import json
import itertools

CONFIG_FILE = "config.json"
INPUT_COMM_FILE = "cbba_sumo_log_from_config.json"
OUTPUT_COMM_FILE = "cbba_sumo_log_with_vehicle_mesh.json"


def load_json(path):
    with open(path, "r") as f:
        return json.load(f)


def extract_task_templates(events):
    templates = {}
    for ev in events:
        if ev.get("type") != "mesh_message":
            continue
        msg = ev.get("message", {})
        if msg.get("message_type") != "FORWARD_ANNOUNCEMENT":
            continue
        tid = msg.get("task_id")
        if not tid:
            continue
        if tid not in templates:
            templates[tid] = {
                "task_id": tid,
                "pickup": msg.get("pickup"),
                "delivery": msg.get("delivery"),
                "weight": msg.get("weight"),
                "announce_time": ev.get("sim_time", 0.0),
            }
    return templates


def build_vehicle_mesh_messages(vehicles, task_templates, base_events):
    new_events = []
    vehicle_ids = [v["id"] for v in vehicles]
    pairs = list(itertools.permutations(vehicle_ids, 2))

    for tid, tmpl in task_templates.items():
        announce_time = tmpl["announce_time"]
        pickup = tmpl["pickup"]
        delivery = tmpl["delivery"]
        weight = tmpl["weight"]

        for idx, (src, dst) in enumerate(pairs):
            t = announce_time + 0.1 * (idx + 1)
            new_events.append({
                "type": "mesh_message",
                "sim_time": t,
                "from": src,
                "to": dst,
                "direction": "TASK_ANNOUNCEMENT_FORWARD",
                "message": {
                    "message_type": "FORWARD_ANNOUNCEMENT",
                    "task_id": tid,
                    "pickup": pickup,
                    "delivery": delivery,
                    "weight": weight,
                    "path": [src, dst],
                    "best": {"bid": None, "holder": None}
                }
            })

    all_events = base_events + new_events
    all_events_sorted = sorted(all_events, key=lambda e: e.get("sim_time", 0.0))
    return all_events_sorted


def main():
    cfg = load_json(CONFIG_FILE)
    comm = load_json(INPUT_COMM_FILE)

    vehicles = cfg.get("vehicles", [])
    events = comm.get("events", [])

    task_templates = extract_task_templates(events)

    new_events = build_vehicle_mesh_messages(vehicles, task_templates, events)

    out = {"events": new_events}
    with open(OUTPUT_COMM_FILE, "w") as f:
        json.dump(out, f, indent=2)

    print(f"Wrote {len(new_events)} events to {OUTPUT_COMM_FILE}")


if __name__ == "__main__":
    main()
