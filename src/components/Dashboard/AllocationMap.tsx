import { useMemo } from 'react'
import { Vehicle, Task, Allocation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface AllocationMapProps {
  vehicles: Vehicle[]
  tasks: Task[]
  assignments: Allocation
  focusVehicle?: string | null
}

export function AllocationMap({ vehicles, tasks, assignments, focusVehicle }: AllocationMapProps) {
  const colors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#a16207']

  const vehicleColors = useMemo(() => {
    const map = new Map<string, string>()
    vehicles.forEach((v, i) => {
      map.set(v.id, colors[i % colors.length])
    })
    return map
  }, [vehicles])

  const minX = Math.min(
    ...vehicles.map(v => v.location[0]),
    ...tasks.map(t => t.location[0])
  )
  const maxX = Math.max(
    ...vehicles.map(v => v.location[0]),
    ...tasks.map(t => t.location[0])
  )
  const minY = Math.min(
    ...vehicles.map(v => v.location[1]),
    ...tasks.map(t => t.location[1])
  )
  const maxY = Math.max(
    ...vehicles.map(v => v.location[1]),
    ...tasks.map(t => t.location[1])
  )

  const padding = 10
  const width = 600
  const height = 600
  const scaleX = (maxX - minX) > 0 ? (width - 2 * padding) / (maxX - minX) : 1
  const scaleY = (maxY - minY) > 0 ? (height - 2 * padding) / (maxY - minY) : 1

  const toX = (x: number) => padding + (x - minX) * scaleX
  const toY = (y: number) => height - padding - (y - minY) * scaleY

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <svg width={width} height={height} className="border rounded">
            {/* Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Task routes */}
            {vehicles.map(vehicle => {
              const taskIds = assignments[vehicle.id] || []
              if (taskIds.length === 0) return null

              const taskById = new Map(tasks.map(t => [t.id, t]))
              const ordered = [...taskIds]
                .map(id => taskById.get(id)!)
                .filter(Boolean)
                .sort((a, b) => {
                  const distA = Math.sqrt(
                    (vehicle.location[0] - a.location[0]) ** 2 +
                    (vehicle.location[1] - a.location[1]) ** 2
                  )
                  const distB = Math.sqrt(
                    (vehicle.location[0] - b.location[0]) ** 2 +
                    (vehicle.location[1] - b.location[1]) ** 2
                  )
                  return distA - distB
                })

              const color = vehicleColors.get(vehicle.id) || '#3b82f6'
              const isFocused = !focusVehicle || focusVehicle === vehicle.id
              const opacity = isFocused ? 1.0 : 0.3

              const points = [
                [vehicle.location[0], vehicle.location[1]],
                ...ordered.map(t => [t.location[0], t.location[1]])
              ]

              return (
                <polyline
                  key={vehicle.id}
                  points={points.map(([x, y]) => `${toX(x)},${toY(y)}`).join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity={opacity}
                />
              )
            })}

            {/* Tasks */}
            {tasks.map(task => (
              <g key={task.id}>
                <circle
                  cx={toX(task.location[0])}
                  cy={toY(task.location[1])}
                  r="6"
                  fill="#6b7280"
                />
                <text
                  x={toX(task.location[0]) + 8}
                  y={toY(task.location[1]) + 4}
                  fontSize="10"
                  fill="#e5e7eb"
                >
                  T{task.id}
                </text>
              </g>
            ))}

            {/* Vehicles */}
            {vehicles.map((vehicle, i) => {
              const color = vehicleColors.get(vehicle.id) || colors[i % colors.length]
              const isFocused = !focusVehicle || focusVehicle === vehicle.id
              const opacity = isFocused ? 1.0 : 0.3

              return (
                <g key={vehicle.id}>
                  <polygon
                    points={`${toX(vehicle.location[0])},${toY(vehicle.location[1]) - 8} ${toX(vehicle.location[0]) - 6},${toY(vehicle.location[1]) + 6} ${toX(vehicle.location[0]) + 6},${toY(vehicle.location[1]) + 6}`}
                    fill={color}
                    opacity={opacity}
                  />
                  <text
                    x={toX(vehicle.location[0]) + 8}
                    y={toY(vehicle.location[1]) + 4}
                    fontSize="11"
                    fill={color}
                    fontWeight="bold"
                    opacity={opacity}
                  >
                    {vehicle.id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

