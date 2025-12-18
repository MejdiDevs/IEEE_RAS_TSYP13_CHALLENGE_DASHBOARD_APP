import json
import math
from typing import Dict, List, Tuple

import numpy as np
import streamlit as st
import matplotlib.pyplot as plt


class Task:
    def __init__(self, d: Dict):
        self.id = d["id"]
        self.location = tuple(d.get("location", [0.0, 0.0]))
        self.demand = d.get("demand", 0.0)
        self.time_window = tuple(d.get("time_window", [0.0, 0.0]))
        self.service_time = d.get("service_time", 0.0)
        self.estimated_energy = d.get("estimated_energy", 0.0)
        self.priority = d.get("priority", 1)
        self.task_type = d.get("task_type", "delivery")
        self.required_uavs = d.get("required_uavs", 1)


class Vehicle:
    def __init__(self, d: Dict):
        self.id = d["id"]
        self.capacity = d.get("capacity", 0.0)
        self.remaining_capacity = self.capacity
        self.energy_capacity = d.get("energy_capacity", 0.0)
        self.location = tuple(d.get("location", [0.0, 0.0]))
        self.speed = d.get("speed", 5.0)
        self.vehicle_type = d.get("vehicle_type", "delivery")
        caps = d.get("capabilities", [self.vehicle_type])
        if isinstance(caps, str):
            caps = [caps]
        self.capabilities = caps


def euclidean_distance(a: Tuple[float, float], b: Tuple[float, float]) -> float:
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)


def compute_cost(vehicle: Vehicle, task: Task, current_time: float = 0.0) -> float:
    if task.task_type not in vehicle.capabilities:
        return float("-inf")
    distance = euclidean_distance(vehicle.location, task.location)
    base_score = 1000.0 / (1.0 + distance)
    priority_multiplier = task.priority
    capability_bonus = 1.0
    demand_feasible = task.demand <= vehicle.remaining_capacity
    if not demand_feasible:
        return float("-inf")
    capacity_penalty = 1.0 if demand_feasible else 0.1
    travel_time = distance / max(vehicle.speed, 0.01)
    arrival_time = current_time + travel_time
    tw_start, tw_end = task.time_window
    if arrival_time > tw_end:
        time_penalty = 0.1
    elif arrival_time < tw_start:
        time_penalty = 0.8
    else:
        time_penalty = 1.0
    return base_score * priority_multiplier * capability_bonus * capacity_penalty * time_penalty


def greedy_allocation(vehicles: List[Vehicle], tasks: List[Task]):
    assignments = {v.id: [] for v in vehicles}
    remaining = set(t.id for t in tasks)
    task_by_id = {t.id: t for t in tasks}
    while remaining:
        best_pair = None
        best_cost = float("-inf")
        for v in vehicles:
            for tid in remaining:
                cost = compute_cost(v, task_by_id[tid])
                if cost > best_cost:
                    best_cost = cost
                    best_pair = (v, task_by_id[tid])
        if best_pair is None or best_cost == float("-inf"):
            break
        v, t = best_pair
        assignments[v.id].append(t.id)
        v.remaining_capacity -= t.demand
        remaining.remove(t.id)
    return assignments


def compute_route_lengths(vehicles, tasks, assignments):
    task_by_id = {t.id: t for t in tasks}
    results = {}
    for v in vehicles:
        tids = assignments.get(v.id, [])
        if not tids:
            results[v.id] = 0.0
            continue
        ordered = sorted(
            [task_by_id[t] for t in tids],
            key=lambda t: euclidean_distance(v.location, t.location),
        )
        dist_sum = 0.0
        curr = v.location
        for t in ordered:
            dist_sum += euclidean_distance(curr, t.location)
            curr = t.location
        results[v.id] = dist_sum
    return results


def compute_vehicle_alerts(vehicles, tasks, assignments):
    alerts = []
    task_by_id = {t.id: t for t in tasks}
    for v in vehicles:
        tids = assignments.get(v.id, [])
        assigned_tasks = [task_by_id[t] for t in tids]
        total_demand = sum(t.demand for t in assigned_tasks)
        if v.remaining_capacity < 0:
            alerts.append({"Vehicle": v.id, "Severity": "High", "Message": "Overloaded vehicle"})
            continue
        if v.capacity > 0 and total_demand >= 0.8 * v.capacity:
            alerts.append({"Vehicle": v.id, "Severity": "Medium", "Message": "Vehicle heavily loaded"})
        if not tids:
            alerts.append({"Vehicle": v.id, "Severity": "Low", "Message": "Idle vehicle with no tasks"})
    return alerts


def compute_task_notifications(tasks):
    notes = []
    sorted_tasks = sorted(tasks, key=lambda t: t.time_window[0])
    for t in sorted_tasks:
        if t.priority >= 4:
            urgency = "High"
            msg = "High-priority task"
        elif t.priority == 3:
            urgency = "Medium"
            msg = "Medium-priority task"
        else:
            urgency = "Low"
            msg = "Low-priority task"
        notes.append({
            "Task": f"T{t.id}",
            "Priority": t.priority,
            "Urgency": urgency,
            "Window Start": t.time_window[0],
            "Window End": t.time_window[1],
            "Notification": msg,
        })
    return notes


def get_unallocated_tasks(tasks, assignments):
    allocated = {tid for tids in assignments.values() for tid in tids}
    return [t for t in tasks if t.id not in allocated]


def plot_allocation(vehicles, tasks, assignments, focus=None):
    fig, ax = plt.subplots(figsize=(6, 6))
    for t in tasks:
        ax.scatter(t.location[0], t.location[1], marker="s", s=60)
        ax.text(t.location[0] + 2, t.location[1] + 2, f"T{t.id}", fontsize=7)
    base_colors = ["tab:blue", "tab:green", "tab:red", "tab:orange", "tab:purple", "tab:brown"]
    task_by_id = {t.id: t for t in tasks}
    for i, v in enumerate(vehicles):
        color = base_colors[i % len(base_colors)]
        is_focused = (focus is None) or (focus == v.id)
        alpha = 1.0 if is_focused else 0.3
        vx, vy = v.location
        ax.scatter(vx, vy, marker="^", s=150, color=color, alpha=alpha)
        ax.text(vx + 2, vy + 2, v.id, color=color, alpha=alpha, fontsize=8)
        tids = assignments.get(v.id, [])
        if tids:
            ordered = sorted(
                [task_by_id[t] for t in tids],
                key=lambda t: euclidean_distance((vx, vy), t.location),
            )
            xs = [vx] + [t.location[0] for t in ordered]
            ys = [vy] + [t.location[1] for t in ordered]
            ax.plot(xs, ys, color=color, alpha=alpha, linewidth=1.5)
    ax.set_title("Vehicle-Task Allocation Map")
    ax.grid(True)
    return fig


def plot_tasks_per_vehicle_bar(vehicles, assignments):
    labels = [v.id for v in vehicles]
    counts = [len(assignments.get(v.id, [])) for v in vehicles]
    fig, ax = plt.subplots()
    ax.bar(labels, counts)
    ax.set_title("Number of Tasks per Vehicle")
    ax.set_ylabel("Tasks")
    return fig


def plot_route_length_bar(vehicles, route_lengths):
    labels = [v.id for v in vehicles]
    lengths = [route_lengths.get(v.id, 0.0) for v in vehicles]
    fig, ax = plt.subplots()
    ax.bar(labels, lengths)
    ax.set_title("Route Distance per Vehicle")
    ax.set_ylabel("Distance")
    return fig


def plot_priority_distribution(tasks):
    priorities = [t.priority for t in tasks]
    if not priorities:
        return None
    unique = sorted(set(priorities))
    counts = [priorities.count(p) for p in unique]
    fig, ax = plt.subplots()
    ax.bar([str(p) for p in unique], counts)
    ax.set_title("Task Priority Distribution")
    ax.set_xlabel("Priority")
    ax.set_ylabel("Count")
    return fig


def normalize_config(vehicles_raw, tasks_raw):
    warnings = []
    norm_vehicles = []
    norm_tasks = []
    for v in vehicles_raw:
        v = dict(v)
        if "id" not in v:
            continue
        if "capacity" not in v:
            v["capacity"] = 0.0
        if "location" not in v:
            v["location"] = [0.0, 0.0]
        if "speed" not in v:
            v["speed"] = 5.0
        if "vehicle_type" not in v:
            v["vehicle_type"] = "delivery"
        if "capabilities" not in v:
            v["capabilities"] = [v["vehicle_type"]]
        elif isinstance(v["capabilities"], str):
            v["capabilities"] = [v["capabilities"]]
        norm_vehicles.append(v)
    for t in tasks_raw:
        t = dict(t)
        if t.get("task_type") == "strike":
            warnings.append(f"Task {t.get('id')} removed (strike not allowed).")
            continue
        if "id" not in t:
            continue
        if "location" not in t:
            t["location"] = [0, 0]
        if "demand" not in t:
            t["demand"] = 0
        if "priority" not in t:
            t["priority"] = 1
        if "time_window" not in t:
            t["time_window"] = [0, 0]
        if "task_type" not in t:
            t["task_type"] = "delivery"
        norm_tasks.append(t)
    return norm_vehicles, norm_tasks, warnings


def parse_communication_events(events):
    announcements = []
    winners = []
    vehicle_status = []
    for ev in events:
        etype = ev.get("type")
        if etype == "mesh_message":
            msg = ev.get("message", {})
            mtype = msg.get("message_type")
            if mtype == "FORWARD_ANNOUNCEMENT":
                announcements.append({
                    "time": ev.get("sim_time"),
                    "from": ev.get("from"),
                    "to": ev.get("to"),
                    "task_id": msg.get("task_id"),
                    "pickup.edge": msg.get("pickup"),
                    "delivery.edge": msg.get("delivery"),
                    "weight": msg.get("weight"),
                })
            elif mtype == "WINNER_DECISION":
                best = msg.get("best") or {}
                winners.append({
                    "time": ev.get("sim_time"),
                    "from": ev.get("from"),
                    "to": ev.get("to"),
                    "task_id": msg.get("task_id"),
                    "winner": msg.get("winner"),
                    "best_bid": best.get("bid"),
                    "best_holder": best.get("holder"),
                })
        elif etype == "vehicle_status":
            vehicle_status.append({
                "time": ev.get("sim_time"),
                "vehicle": ev.get("agent"),
                "battery": ev.get("battery"),
                "current_edge": ev.get("current_edge"),
                "next_edge": ev.get("next_edge"),
                "current_task": ev.get("current_task"),
                "assigned_tasks": ", ".join(ev.get("assigned_tasks", [])),
            })
    return announcements, winners, vehicle_status


def generate_beep(frequency=900, duration=0.3, rate=44100):
    t = np.linspace(0, duration, int(rate * duration))
    waveform = (0.5 * np.sin(2 * np.pi * frequency * t)).astype(np.float32)
    return waveform.tobytes()


def apply_theme_dark():
    css = """
    <style>
    body, .block-container, .main { background-color: #0E1117 !important; color: #FFFFFF !important; }
    h1,h2,h3,h4,h5 { color: white !important; }
    section[data-testid="stSidebar"] { background-color: #111827 !important; color: #F5F5F5 !important; }
    table { background-color: #111827 !important; color: #E5E7EB !important; }
    table th { background-color: #1F2937 !important; color: #fff !important; }
    .stButton>button { background-color: #2563EB !important; color: white !important; }
    .stTabs [aria-selected="true"] { color: #60A5FA !important; border-bottom: 2px solid #60A5FA !important; }
    </style>
    """
    st.markdown(css, unsafe_allow_html=True)


def main():
    st.set_page_config(page_title="Tasks Allocation and Vehicles Communication", layout="wide")
    apply_theme_dark()
    if "vehicles_data" not in st.session_state:
        st.session_state["vehicles_data"] = []
    if "tasks_data" not in st.session_state:
        st.session_state["tasks_data"] = []
    if "warnings" not in st.session_state:
        st.session_state["warnings"] = []
    if "comm_events" not in st.session_state:
        st.session_state["comm_events"] = []
    st.sidebar.header("Configuration")
    uploaded = st.sidebar.file_uploader("Load config.json", type=["json"])
    if uploaded:
        cfg = json.load(uploaded)
        v, t, w = normalize_config(cfg.get("vehicles", []), cfg.get("tasks", []))
        st.session_state["vehicles_data"] = v
        st.session_state["tasks_data"] = t
        st.session_state["warnings"] = w
        st.sidebar.success("Configuration loaded.")
    st.sidebar.header("Communication Log")
    comm_file = st.sidebar.file_uploader("Load communication log (JSON)", type=["json"], key="comm_uploader")
    if comm_file is not None:
        try:
            comm_data = json.load(comm_file)
            st.session_state["comm_events"] = comm_data.get("events", [])
            st.sidebar.success("Log loaded.")
        except Exception as e:
            st.sidebar.error(f"Error reading file: {e}")
    st.sidebar.header("Add Vehicle")
    with st.sidebar.form("add_vehicle"):
        vid = st.text_input("Vehicle ID", "veh_new")
        cap = st.number_input("Weight Capacity", 0.0, 1000.0, 50.0)
        energy = st.number_input("Energy Capacity", 0.0, 10000.0, 100.0)
        lon = st.number_input("Longitude", -180.0, 180.0, 0.0)
        lat = st.number_input("Latitude", -90.0, 90.0, 0.0)
        sp = st.number_input("Speed", 0.1, 100.0, 5.0)
        vtype = st.selectbox("Vehicle Type", ["delivery", "reconnaissance", "strike"])
        caps = st.multiselect("Capabilities", options=["delivery", "reconnaissance", "strike"], default=[vtype])
        submit = st.form_submit_button("Add Vehicle")
        if submit:
            st.session_state["vehicles_data"].append({
                "id": vid,
                "capacity": cap,
                "energy_capacity": energy,
                "location": [lon, lat],
                "speed": sp,
                "vehicle_type": vtype,
                "capabilities": caps or [vtype],
            })
            st.sidebar.success("Vehicle added.")
    st.title("Tasks Allocation and Vehicles Communication")
    vehicles_data = st.session_state["vehicles_data"]
    tasks_data = st.session_state["tasks_data"]
    if st.session_state["warnings"]:
        st.warning("\n".join(st.session_state["warnings"]))
    tab_dashboard, tab_comm = st.tabs(["Dashboard", "Communication"])
    with tab_dashboard:
        if not vehicles_data or not tasks_data:
            st.info("Load a config file in the sidebar.")
            return
        vehicles = [Vehicle(v) for v in vehicles_data]
        tasks = [Task(t) for t in tasks_data]
        assignments = greedy_allocation(vehicles, tasks)
        route_lengths = compute_route_lengths(vehicles, tasks, assignments)
        allocated = {tid for tids in assignments.values() for tid in tids}
        unallocated = [t for t in tasks if t.id not in allocated]
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Vehicles", len(vehicles))
        c2.metric("Tasks", len(tasks))
        c3.metric("Allocated", len(allocated))
        c4.metric("Unallocated", len(unallocated))
        st.markdown("---")
        scenario_json = json.dumps({"vehicles": vehicles_data, "tasks": tasks_data}, indent=2)
        st.download_button(
            label="Download current scenario",
            data=scenario_json,
            file_name="scenario_config.json",
            mime="application/json",
        )
        t_data, t_alloc, t_vis, t_dash, t_alert, t_unalloc, t_notify = st.tabs(
            ["Data", "Allocation", "Visualization", "Dashboards", "Vehicle Alerts", "Unallocated Tasks", "Notifications"]
        )
        with t_data:
            st.subheader("Vehicles")
            st.table([
                {
                    "ID": v.id,
                    "Capacity": v.capacity,
                    "Energy Capacity": v.energy_capacity,
                    "Location (lon, lat)": v.location,
                    "Speed": v.speed,
                    "Type": v.vehicle_type,
                    "Capabilities": ", ".join(v.capabilities),
                }
                for v in vehicles
            ])
            st.subheader("Tasks")
            st.table([
                {
                    "ID": t.id,
                    "Priority": t.priority,
                    "Demand": t.demand,
                    "Location": t.location,
                    "Time Window": t.time_window,
                    "Type": t.task_type,
                }
                for t in tasks
            ])
        with t_alloc:
            st.subheader("Allocation Results")
            st.table([
                {
                    "Vehicle": v.id,
                    "Capacity": v.capacity,
                    "Remaining": v.remaining_capacity,
                    "Tasks": ", ".join([f"T{x}" for x in assignments[v.id]]) or "None",
                    "Route": f"{route_lengths[v.id]:.1f}",
                }
                for v in vehicles
            ])
            st.subheader("Cost Matrix")
            header = ["Vehicle / Task"] + [f"T{t.id}" for t in tasks]
            matrix = [header]
            for v in vehicles:
                row = [v.id]
                for t in tasks:
                    c = compute_cost(v, t)
                    row.append("−∞" if c == float("-inf") else f"{c:.1f}")
                matrix.append(row)
            st.table(matrix)
        with t_vis:
            st.subheader("Allocation Map")
            focus = st.selectbox("Focus Vehicle", ["All"] + [v.id for v in vehicles])
            fig = plot_allocation(vehicles, tasks, assignments, focus=None if focus == "All" else focus)
            st.pyplot(fig)
        with t_dash:
            st.subheader("Dashboards")
            col_a, col_b = st.columns(2)
            with col_a:
                fig1 = plot_tasks_per_vehicle_bar(vehicles, assignments)
                st.pyplot(fig1)
            with col_b:
                fig2 = plot_route_length_bar(vehicles, route_lengths)
                st.pyplot(fig2)
            fig3 = plot_priority_distribution(tasks)
            if fig3 is not None:
                st.pyplot(fig3)
            else:
                st.info("No tasks available.")
        with t_alert:
            st.subheader("Vehicle Alerts")
            alerts = compute_vehicle_alerts(vehicles, tasks, assignments)
            st.table(alerts if alerts else [{"Message": "No alerts"}])
        with t_unalloc:
            st.subheader("Unallocated Tasks")
            st.table([
                {"ID": t.id, "Priority": t.priority, "Demand": t.demand, "Location": t.location}
                for t in unallocated
            ] or [{"Message": "All tasks allocated"}])
        with t_notify:
            st.subheader("Notifications")
            notes = compute_task_notifications(tasks)
            st.table(notes)
            if any(n["Urgency"] == "High" for n in notes):
                if st.checkbox("Play alert sound"):
                    st.audio(generate_beep(), format="audio/wav")
    with tab_comm:
        st.subheader("Communication Log")
        events = st.session_state.get("comm_events", [])
        if not events:
            st.info("Upload a communication file in the sidebar.")
            return
        announcements, winners, vehicle_status = parse_communication_events(events)
        all_vehicles_for_filter = sorted({
            *(r.get("from") for r in announcements),
            *(r.get("to") for r in announcements),
            *(r.get("from") for r in winners),
            *(r.get("to") for r in winners),
            *(r.get("vehicle") for r in vehicle_status),
        } - {None})
        selected = st.selectbox(
            "Vehicle Filter",
            options=["All"] + all_vehicles_for_filter,
            index=0,
        )
        def flt(rows, keys):
            if selected == "All":
                return rows
            return [r for r in rows if any(r.get(k) == selected for k in keys)]
        st.subheader("Task Announcements")
        ann_view = flt(announcements, ["from", "to"])
        st.table(ann_view if ann_view else [{"info": "None"}])
        st.subheader("Winner Decisions")
        win_view = flt(winners, ["from", "to", "winner", "best_holder"])
        st.table(win_view if win_view else [{"info": "None"}])
        st.subheader("Vehicle Status")
        stat_view = flt(vehicle_status, ["vehicle"])
        st.table(stat_view if stat_view else [{"info": "None"}])


if __name__ == "__main__":
    main()
