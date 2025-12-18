import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ref, onValue, set, push, remove, update, get } from 'firebase/database'
import { database } from '@/lib/firebase'
import { useAuth } from './AuthContext'
import { Vehicle, Task, CommunicationEvent } from '@/types'
import { normalizeConfig } from '@/lib/normalize'

interface DataContextType {
  vehicles: Vehicle[]
  tasks: Task[]
  commEvents: CommunicationEvent[]
  warnings: string[]
  customTaskOrders: Record<string, string[]> // vehicleId -> ordered taskIds
  addVehicle: (vehicle: Vehicle) => Promise<void>
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => Promise<void>
  deleteVehicle: (id: string) => Promise<void>
  addTask: (task: Task) => Promise<void>
  updateTask: (id: string, task: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setCustomTaskOrder: (vehicleId: string, taskIds: string[]) => void
  loadConfig: (vehicles: Vehicle[], tasks: Task[], warnings: string[]) => Promise<void>
  loadCommLog: (events: CommunicationEvent[]) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [commEvents, setCommEvents] = useState<CommunicationEvent[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [customTaskOrders, setCustomTaskOrders] = useState<Record<string, string[]>>({})

  // Sample data generator
  const generateSampleData = () => {
    const sampleVehicles: Vehicle[] = [
      {
        id: 'V1',
        capacity: 200,
        energy_capacity: 500,
        location: [10.0, 20.0],
        speed: 5.0,
        vehicle_type: 'delivery',
        capabilities: ['delivery'],
        remaining_capacity: 200
      },
      {
        id: 'V2',
        capacity: 180,
        energy_capacity: 400,
        location: [15.0, 25.0],
        speed: 6.0,
        vehicle_type: 'delivery',
        capabilities: ['delivery'],
        remaining_capacity: 180
      },
      {
        id: 'V3',
        capacity: 150,
        energy_capacity: 300,
        location: [12.0, 18.0],
        speed: 7.0,
        vehicle_type: 'reconnaissance',
        capabilities: ['reconnaissance'],
        remaining_capacity: 150
      }
    ]

    const sampleTasks: Task[] = [
      {
        id: 'T1',
        location: [11.0, 21.0],
        demand: 25,
        time_window: [0, 1000],
        priority: 3,
        task_type: 'delivery',
        service_time: 5,
        estimated_energy: 50
      },
      {
        id: 'T2',
        location: [16.0, 26.0],
        demand: 30,
        time_window: [0, 1000],
        priority: 4,
        task_type: 'delivery',
        service_time: 8,
        estimated_energy: 60
      },
      {
        id: 'T3',
        location: [13.0, 19.0],
        demand: 20,
        time_window: [0, 1000],
        priority: 2,
        task_type: 'reconnaissance',
        service_time: 3,
        estimated_energy: 40
      },
      {
        id: 'T4',
        location: [14.0, 22.0],
        demand: 35,
        time_window: [0, 1000],
        priority: 5,
        task_type: 'delivery',
        service_time: 10,
        estimated_energy: 70
      },
      {
        id: 'T5',
        location: [17.0, 23.0],
        demand: 20,
        time_window: [0, 1000],
        priority: 3,
        task_type: 'delivery',
        service_time: 6,
        estimated_energy: 45
      },
      {
        id: 'T6',
        location: [9.0, 17.0],
        demand: 25,
        time_window: [0, 1000],
        priority: 4,
        task_type: 'delivery',
        service_time: 7,
        estimated_energy: 55
      },
      {
        id: 'T7',
        location: [18.0, 27.0],
        demand: 15,
        time_window: [0, 1000],
        priority: 2,
        task_type: 'reconnaissance',
        service_time: 4,
        estimated_energy: 35
      },
      {
        id: 'T8',
        location: [12.0, 24.0],
        demand: 30,
        time_window: [0, 1000],
        priority: 5,
        task_type: 'delivery',
        service_time: 9,
        estimated_energy: 65
      },
    ]

    const { vehicles, tasks, warnings } = normalizeConfig(sampleVehicles, sampleTasks)
    
    // Generate sample communication events
    const sampleCommEvents: CommunicationEvent[] = [
      {
        type: 'vehicle_status',
        sim_time: 0.5,
        agent: 'V1',
        battery: 95,
        current_edge: 'depot',
        next_edge: 'T1',
        current_task: 'T1',
        assigned_tasks: ['T1', 'T2']
      },
      {
        type: 'mesh_message',
        sim_time: 1.2,
        from: 'V1',
        to: 'V2',
        direction: 'outgoing',
        message: {
          message_type: 'FORWARD_ANNOUNCEMENT',
          task_id: 'T4',
          pickup: 'depot',
          delivery: 'T4',
          weight: 35,
          path: ['depot', 'T4']
        }
      },
      {
        type: 'vehicle_status',
        sim_time: 2.0,
        agent: 'V2',
        battery: 88,
        current_edge: 'T2',
        next_edge: 'T5',
        current_task: 'T2',
        assigned_tasks: ['T2', 'T5', 'T6']
      },
      {
        type: 'mesh_message',
        sim_time: 2.5,
        from: 'V2',
        to: 'V1',
        direction: 'incoming',
        message: {
          message_type: 'WINNER_DECISION',
          task_id: 'T4',
          winner: 'V1',
          best: {
            bid: 125.5,
            holder: 'V1'
          }
        }
      },
      {
        type: 'vehicle_status',
        sim_time: 3.1,
        agent: 'V3',
        battery: 92,
        current_edge: 'depot',
        next_edge: 'T3',
        current_task: 'T3',
        assigned_tasks: ['T3', 'T7']
      },
      {
        type: 'mesh_message',
        sim_time: 3.8,
        from: 'V1',
        to: 'V3',
        direction: 'outgoing',
        message: {
          message_type: 'FORWARD_ANNOUNCEMENT',
          task_id: 'T8',
          pickup: 'T4',
          delivery: 'T8',
          weight: 30,
          path: ['T4', 'T8']
        }
      },
      {
        type: 'vehicle_status',
        sim_time: 4.5,
        agent: 'V1',
        battery: 82,
        current_edge: 'T1',
        next_edge: 'T4',
        current_task: 'T1',
        assigned_tasks: ['T1', 'T2', 'T4']
      },
      {
        type: 'mesh_message',
        sim_time: 5.2,
        from: 'V3',
        to: 'V1',
        direction: 'incoming',
        message: {
          message_type: 'WINNER_DECISION',
          task_id: 'T8',
          winner: 'V1',
          best: {
            bid: 98.3,
            holder: 'V1'
          }
        }
      },
      {
        type: 'vehicle_status',
        sim_time: 6.0,
        agent: 'V2',
        battery: 75,
        current_edge: 'T5',
        next_edge: 'T6',
        current_task: 'T5',
        assigned_tasks: ['T2', 'T5', 'T6']
      },
      {
        type: 'vehicle_status',
        sim_time: 7.2,
        agent: 'V3',
        battery: 85,
        current_edge: 'T3',
        next_edge: 'T7',
        current_task: 'T3',
        assigned_tasks: ['T3', 'T7']
      },
      {
        type: 'mesh_message',
        sim_time: 8.1,
        from: 'V2',
        to: 'V1',
        direction: 'outgoing',
        message: {
          message_type: 'FORWARD_ANNOUNCEMENT',
          task_id: 'T6',
          pickup: 'T5',
          delivery: 'T6',
          weight: 25,
          path: ['T5', 'T6']
        }
      },
      {
        type: 'vehicle_status',
        sim_time: 9.5,
        agent: 'V1',
        battery: 68,
        current_edge: 'T4',
        next_edge: 'T8',
        current_task: 'T4',
        assigned_tasks: ['T1', 'T2', 'T4', 'T8']
      },
      {
        type: 'vehicle_status',
        sim_time: 10.8,
        agent: 'V2',
        battery: 62,
        current_edge: 'T6',
        next_edge: 'depot',
        current_task: 'T6',
        assigned_tasks: ['T2', 'T5', 'T6']
      },
      {
        type: 'mesh_message',
        sim_time: 11.3,
        from: 'V1',
        to: 'V2',
        direction: 'incoming',
        message: {
          message_type: 'WINNER_DECISION',
          task_id: 'T6',
          winner: 'V2',
          best: {
            bid: 145.2,
            holder: 'V2'
          }
        }
      },
      {
        type: 'vehicle_status',
        sim_time: 12.5,
        agent: 'V3',
        battery: 78,
        current_edge: 'T7',
        next_edge: 'depot',
        current_task: 'T7',
        assigned_tasks: ['T3', 'T7']
      }
    ]
    
    return { vehicles, tasks, warnings, commEvents: sampleCommEvents }
  }

  useEffect(() => {
    if (!currentUser) {
      setVehicles([])
      setTasks([])
      setCommEvents([])
      setWarnings([])
      return
    }

    const vehiclesRef = ref(database, `users/${currentUser.uid}/vehicles`)
    const tasksRef = ref(database, `users/${currentUser.uid}/tasks`)
    const commEventsRef = ref(database, `users/${currentUser.uid}/commEvents`)
    const warningsRef = ref(database, `users/${currentUser.uid}/warnings`)

    // Initialize sample data if empty
    const initializeData = async () => {
      const [vehiclesSnap, tasksSnap, commEventsSnap] = await Promise.all([
        get(vehiclesRef),
        get(tasksRef),
        get(commEventsRef)
      ])

      if (!vehiclesSnap.exists() || !tasksSnap.exists()) {
        const { vehicles, tasks, warnings, commEvents } = generateSampleData()
        
        const vehiclesObj: Record<string, Vehicle> = {}
        vehicles.forEach(v => {
          vehiclesObj[v.id] = v
        })

        const tasksObj: Record<string, Task> = {}
        tasks.forEach(t => {
          tasksObj[t.id] = t
        })

        const commEventsObj: Record<string, CommunicationEvent> = {}
        commEvents.forEach((e, i) => {
          commEventsObj[`event_${i}`] = e
        })

        await Promise.all([
          set(vehiclesRef, vehiclesObj),
          set(tasksRef, tasksObj),
          set(commEventsRef, commEventsObj),
          set(warningsRef, warnings.length > 0 ? warnings : null)
        ])
      } else if (!commEventsSnap.exists()) {
        // If vehicles/tasks exist but comm events don't, initialize just comm events
        const { commEvents } = generateSampleData()
        const commEventsObj: Record<string, CommunicationEvent> = {}
        commEvents.forEach((e, i) => {
          commEventsObj[`event_${i}`] = e
        })
        await set(commEventsRef, commEventsObj)
      }
    }

    initializeData()

    const unsubscribeVehicles = onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setVehicles(Object.values(data) as Vehicle[])
      } else {
        setVehicles([])
      }
    })

    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setTasks(Object.values(data) as Task[])
      } else {
        setTasks([])
      }
    })

    const unsubscribeCommEvents = onValue(commEventsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setCommEvents(Object.values(data) as CommunicationEvent[])
      } else {
        setCommEvents([])
      }
    })

    const unsubscribeWarnings = onValue(warningsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Handle both array and object formats
        if (Array.isArray(data)) {
          setWarnings(data)
        } else {
          setWarnings(Object.values(data) as string[])
        }
      } else {
        setWarnings([])
      }
    })

    return () => {
      unsubscribeVehicles()
      unsubscribeTasks()
      unsubscribeCommEvents()
      unsubscribeWarnings()
    }
  }, [currentUser])

  async function addVehicle(vehicle: Vehicle) {
    if (!currentUser) return
    const vehicleRef = ref(database, `users/${currentUser.uid}/vehicles/${vehicle.id}`)
    await set(vehicleRef, vehicle)
  }

  async function updateVehicle(id: string, updates: Partial<Vehicle>) {
    if (!currentUser) return
    const vehicleRef = ref(database, `users/${currentUser.uid}/vehicles/${id}`)
    await update(vehicleRef, updates)
  }

  async function deleteVehicle(id: string) {
    if (!currentUser) return
    const vehicleRef = ref(database, `users/${currentUser.uid}/vehicles/${id}`)
    await remove(vehicleRef)
  }

  async function addTask(task: Task) {
    if (!currentUser) return
    const taskRef = ref(database, `users/${currentUser.uid}/tasks/${task.id}`)
    await set(taskRef, task)
  }

  async function updateTask(id: string, updates: Partial<Task>) {
    if (!currentUser) return
    const taskRef = ref(database, `users/${currentUser.uid}/tasks/${id}`)
    await update(taskRef, updates)
  }

  async function deleteTask(id: string) {
    if (!currentUser) return
    const taskRef = ref(database, `users/${currentUser.uid}/tasks/${id}`)
    await remove(taskRef)
  }

  async function loadConfig(vehicles: Vehicle[], tasks: Task[], warnings: string[]) {
    if (!currentUser) return
    
    const vehiclesRef = ref(database, `users/${currentUser.uid}/vehicles`)
    const tasksRef = ref(database, `users/${currentUser.uid}/tasks`)
    const warningsRef = ref(database, `users/${currentUser.uid}/warnings`)

    const vehiclesObj: Record<string, Vehicle> = {}
    vehicles.forEach(v => {
      vehiclesObj[v.id] = v
    })

    const tasksObj: Record<string, Task> = {}
    tasks.forEach(t => {
      tasksObj[t.id] = t
    })

    await Promise.all([
      set(vehiclesRef, vehiclesObj),
      set(tasksRef, tasksObj),
      set(warningsRef, warnings)
    ])
  }

  async function loadCommLog(events: CommunicationEvent[]) {
    if (!currentUser) return
    const commEventsRef = ref(database, `users/${currentUser.uid}/commEvents`)
    const eventsObj: Record<string, CommunicationEvent> = {}
    events.forEach((e, i) => {
      eventsObj[`event_${i}`] = e
    })
    await set(commEventsRef, eventsObj)
  }

  function setCustomTaskOrder(vehicleId: string, taskIds: string[]) {
    setCustomTaskOrders(prev => ({
      ...prev,
      [vehicleId]: taskIds
    }))
  }

  const value = {
    vehicles,
    tasks,
    commEvents,
    warnings,
    customTaskOrders,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addTask,
    updateTask,
    deleteTask,
    setCustomTaskOrder,
    loadConfig,
    loadCommLog
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

