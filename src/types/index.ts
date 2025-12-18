export interface Vehicle {
  id: string
  capacity: number
  energy_capacity: number
  location: [number, number] // [longitude, latitude]
  speed: number
  vehicle_type: 'delivery' | 'reconnaissance' | 'strike'
  capabilities: string[]
  remaining_capacity?: number
}

export interface Task {
  id: string
  location: [number, number]
  demand: number
  time_window: [number, number]
  service_time?: number
  estimated_energy?: number
  priority: number
  task_type: string
  required_uavs?: number
}

export interface CommunicationEvent {
  type: 'mesh_message' | 'vehicle_status'
  sim_time: number
  from?: string
  to?: string
  direction?: string
  message?: {
    message_type: 'FORWARD_ANNOUNCEMENT' | 'WINNER_DECISION'
    task_id?: string
    pickup?: string
    delivery?: string
    weight?: number
    path?: string[]
    best?: {
      bid?: number | null
      holder?: string | null
    }
    winner?: string
  }
  agent?: string
  battery?: number
  current_edge?: string
  next_edge?: string
  current_task?: string | null
  assigned_tasks?: string[]
}

export interface Allocation {
  [vehicleId: string]: string[]
}

export interface VehicleAlert {
  Vehicle: string
  Severity: 'High' | 'Medium' | 'Low'
  Message: string
}

export interface TaskNotification {
  Task: string
  Priority: number
  Urgency: 'High' | 'Medium' | 'Low'
  'Window Start': number
  'Window End': number
  Notification: string
}

