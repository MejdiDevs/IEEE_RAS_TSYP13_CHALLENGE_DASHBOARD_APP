import { Vehicle, Task, Allocation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { computeCost } from '@/lib/allocation'

interface AllocationTableProps {
  vehicles: Vehicle[]
  tasks: Task[]
  assignments: Allocation
  routeLengths: Record<string, number>
}

export function AllocationTable({
  vehicles,
  tasks,
  assignments,
  routeLengths
}: AllocationTableProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Allocation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-left p-2">Capacity</th>
                  <th className="text-left p-2">Remaining</th>
                  <th className="text-left p-2">Tasks</th>
                  <th className="text-left p-2">Route</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">{vehicle.id}</td>
                    <td className="p-2">{vehicle.capacity}</td>
                    <td className="p-2">{vehicle.remaining_capacity?.toFixed(1) || vehicle.capacity}</td>
                    <td className="p-2">
                      {assignments[vehicle.id]?.map(id => `T${id}`).join(', ') || 'None'}
                    </td>
                    <td className="p-2">{routeLengths[vehicle.id]?.toFixed(1) || '0.0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Vehicle / Task</th>
                  {tasks.map(task => (
                    <th key={task.id} className="text-left p-2">T{task.id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{vehicle.id}</td>
                    {tasks.map(task => {
                      const cost = computeCost(vehicle, task)
                      return (
                        <td key={task.id} className="p-2">
                          {cost === -Infinity ? '−∞' : cost.toFixed(1)}
                        </td>
                      )
                    })}
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

