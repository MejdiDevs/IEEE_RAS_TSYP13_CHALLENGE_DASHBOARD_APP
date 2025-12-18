import { Vehicle, Task, Allocation, VehicleAlert, TaskNotification } from '@/types'

export function euclideanDistance(a: [number, number], b: [number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

export function computeCost(
  vehicle: Vehicle,
  task: Task,
  currentTime: number = 0.0
): number {
  if (!vehicle.capabilities.includes(task.task_type)) {
    return -Infinity
  }
  
  const distance = euclideanDistance(vehicle.location, task.location)
  const baseScore = 1000.0 / (1.0 + distance)
  const priorityMultiplier = task.priority
  const capabilityBonus = 1.0
  const demandFeasible = task.demand <= (vehicle.remaining_capacity ?? vehicle.capacity)
  
  if (!demandFeasible) {
    return -Infinity
  }
  
  const capacityPenalty = 1.0
  const travelTime = distance / Math.max(vehicle.speed, 0.01)
  const arrivalTime = currentTime + travelTime
  const [twStart, twEnd] = task.time_window
  
  let timePenalty: number
  if (arrivalTime > twEnd) {
    timePenalty = 0.1
  } else if (arrivalTime < twStart) {
    timePenalty = 0.8
  } else {
    timePenalty = 1.0
  }
  
  return baseScore * priorityMultiplier * capabilityBonus * capacityPenalty * timePenalty
}

export function greedyAllocation(vehicles: Vehicle[], tasks: Task[]): Allocation {
  const assignments: Allocation = {}
  vehicles.forEach(v => {
    assignments[v.id] = []
    v.remaining_capacity = v.capacity
  })
  
  const remaining = new Set(tasks.map(t => t.id))
  const taskById = new Map(tasks.map(t => [t.id, t]))
  
  while (remaining.size > 0) {
    let bestPair: [Vehicle, Task] | null = null
    let bestCost = -Infinity
    
    for (const vehicle of vehicles) {
      for (const taskId of remaining) {
        const task = taskById.get(taskId)!
        const cost = computeCost(vehicle, task)
        if (cost > bestCost) {
          bestCost = cost
          bestPair = [vehicle, task]
        }
      }
    }
    
    if (!bestPair || bestCost === -Infinity) {
      break
    }
    
    const [vehicle, task] = bestPair
    assignments[vehicle.id].push(task.id)
    vehicle.remaining_capacity! -= task.demand
    remaining.delete(task.id)
  }
  
  return assignments
}

export function computeRouteLengths(
  vehicles: Vehicle[],
  tasks: Task[],
  assignments: Allocation
): Record<string, number> {
  const taskById = new Map(tasks.map(t => [t.id, t]))
  const results: Record<string, number> = {}
  
  for (const vehicle of vehicles) {
    const taskIds = assignments[vehicle.id] || []
    if (taskIds.length === 0) {
      results[vehicle.id] = 0.0
      continue
    }
    
    const ordered = [...taskIds]
      .map(id => taskById.get(id)!)
      .sort((a, b) => {
        const distA = euclideanDistance(vehicle.location, a.location)
        const distB = euclideanDistance(vehicle.location, b.location)
        return distA - distB
      })
    
    let distSum = 0.0
    let curr = vehicle.location
    for (const task of ordered) {
      distSum += euclideanDistance(curr, task.location)
      curr = task.location
    }
    results[vehicle.id] = distSum
  }
  
  return results
}

export function computeVehicleAlerts(
  vehicles: Vehicle[],
  tasks: Task[],
  assignments: Allocation
): VehicleAlert[] {
  const alerts: VehicleAlert[] = []
  const taskById = new Map(tasks.map(t => [t.id, t]))
  
  for (const vehicle of vehicles) {
    const taskIds = assignments[vehicle.id] || []
    const assignedTasks = taskIds.map(id => taskById.get(id)!).filter(Boolean)
    const totalDemand = assignedTasks.reduce((sum, t) => sum + t.demand, 0)
    
    if ((vehicle.remaining_capacity ?? vehicle.capacity) < 0) {
      alerts.push({
        Vehicle: vehicle.id,
        Severity: 'High',
        Message: 'Overloaded vehicle'
      })
      continue
    }
    
    if (vehicle.capacity > 0 && totalDemand >= 0.8 * vehicle.capacity) {
      alerts.push({
        Vehicle: vehicle.id,
        Severity: 'Medium',
        Message: 'Vehicle heavily loaded'
      })
    }
    
    if (taskIds.length === 0) {
      alerts.push({
        Vehicle: vehicle.id,
        Severity: 'Low',
        Message: 'Idle vehicle with no tasks'
      })
    }
  }
  
  return alerts
}

export function computeTaskNotifications(tasks: Task[]): TaskNotification[] {
  const notes: TaskNotification[] = []
  const sortedTasks = [...tasks].sort((a, b) => a.time_window[0] - b.time_window[0])
  
  for (const task of sortedTasks) {
    let urgency: 'High' | 'Medium' | 'Low'
    let msg: string
    
    if (task.priority >= 4) {
      urgency = 'High'
      msg = 'High-priority task'
    } else if (task.priority === 3) {
      urgency = 'Medium'
      msg = 'Medium-priority task'
    } else {
      urgency = 'Low'
      msg = 'Low-priority task'
    }
    
    notes.push({
      Task: `T${task.id}`,
      Priority: task.priority,
      Urgency: urgency,
      'Window Start': task.time_window[0],
      'Window End': task.time_window[1],
      Notification: msg
    })
  }
  
  return notes
}

export function getUnallocatedTasks(tasks: Task[], assignments: Allocation): Task[] {
  const allocated = new Set(
    Object.values(assignments).flatMap(ids => ids)
  )
  return tasks.filter(t => !allocated.has(t.id))
}

