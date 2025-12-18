import { Vehicle, Task } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Pencil, Trash2 } from 'lucide-react'

interface DataTablesProps {
  vehicles: Vehicle[]
  tasks: Task[]
  onEditVehicle: (vehicle: Vehicle) => void
  onDeleteVehicle: (id: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

export function DataTables({
  vehicles,
  tasks,
  onEditVehicle,
  onDeleteVehicle,
  onEditTask,
  onDeleteTask
}: DataTablesProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Capacity</th>
                  <th className="text-left p-2">Energy</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Speed</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Capabilities</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{vehicle.id}</td>
                    <td className="p-2">{vehicle.capacity}</td>
                    <td className="p-2">{vehicle.energy_capacity}</td>
                    <td className="p-2">
                      [{vehicle.location[0].toFixed(1)}, {vehicle.location[1].toFixed(1)}]
                    </td>
                    <td className="p-2">{vehicle.speed}</td>
                    <td className="p-2 capitalize">{vehicle.vehicle_type}</td>
                    <td className="p-2">{vehicle.capabilities.join(', ')}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditVehicle(vehicle)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteVehicle(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Demand</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Time Window</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{task.id}</td>
                    <td className="p-2">{task.priority}</td>
                    <td className="p-2">{task.demand}</td>
                    <td className="p-2">
                      [{task.location[0].toFixed(1)}, {task.location[1].toFixed(1)}]
                    </td>
                    <td className="p-2">
                      [{task.time_window[0]}, {task.time_window[1]}]
                    </td>
                    <td className="p-2 capitalize">{task.task_type}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditTask(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

