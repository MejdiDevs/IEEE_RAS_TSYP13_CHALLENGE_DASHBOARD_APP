import { Vehicle, Task } from '@/types'

export function normalizeConfig(
  vehiclesRaw: any[],
  tasksRaw: any[]
): { vehicles: Vehicle[]; tasks: Task[]; warnings: string[] } {
  const warnings: string[] = []
  const normVehicles: Vehicle[] = []
  const normTasks: Task[] = []

  for (const v of vehiclesRaw) {
    const vehicle = { ...v }
    if (!vehicle.id) continue

    if (!vehicle.capacity) vehicle.capacity = 0.0
    if (!vehicle.location) vehicle.location = [0.0, 0.0]
    if (!vehicle.speed) vehicle.speed = 5.0
    if (!vehicle.vehicle_type) vehicle.vehicle_type = 'delivery'
    if (!vehicle.capabilities) {
      vehicle.capabilities = [vehicle.vehicle_type]
    } else if (typeof vehicle.capabilities === 'string') {
      vehicle.capabilities = [vehicle.capabilities]
    }
    if (!vehicle.energy_capacity) vehicle.energy_capacity = 100.0

    normVehicles.push(vehicle as Vehicle)
  }

  for (const t of tasksRaw) {
    const task = { ...t }
    if (task.task_type === 'strike') {
      warnings.push(`Task ${task.id} removed (strike not allowed).`)
      continue
    }
    if (!task.id) continue

    if (!task.location) task.location = [0, 0]
    if (task.demand === undefined) task.demand = 0
    if (!task.priority) task.priority = 1
    if (!task.time_window) task.time_window = [0, 0]
    if (!task.task_type) task.task_type = 'delivery'

    normTasks.push(task as Task)
  }

  return { vehicles: normVehicles, tasks: normTasks, warnings }
}

export function parseCommunicationEvents(events: any[]) {
  const announcements: any[] = []
  const winners: any[] = []
  const vehicleStatus: any[] = []

  for (const ev of events) {
    const etype = ev.type
    if (etype === 'mesh_message') {
      const msg = ev.message || {}
      const mtype = msg.message_type
      if (mtype === 'FORWARD_ANNOUNCEMENT') {
        announcements.push({
          time: ev.sim_time,
          from: ev.from,
          to: ev.to,
          task_id: msg.task_id,
          'pickup.edge': msg.pickup,
          'delivery.edge': msg.delivery,
          weight: msg.weight
        })
      } else if (mtype === 'WINNER_DECISION') {
        const best = msg.best || {}
        winners.push({
          time: ev.sim_time,
          from: ev.from,
          to: ev.to,
          task_id: msg.task_id,
          winner: msg.winner,
          best_bid: best.bid,
          best_holder: best.holder
        })
      }
    } else if (etype === 'vehicle_status') {
      vehicleStatus.push({
        time: ev.sim_time,
        vehicle: ev.agent,
        battery: ev.battery,
        current_edge: ev.current_edge,
        next_edge: ev.next_edge,
        current_task: ev.current_task,
        assigned_tasks: (ev.assigned_tasks || []).join(', ')
      })
    }
  }

  return { announcements, winners, vehicleStatus }
}

