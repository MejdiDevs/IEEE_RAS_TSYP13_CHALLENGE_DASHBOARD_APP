import { useState, useMemo } from 'react'
import { CommunicationEvent } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { parseCommunicationEvents } from '@/lib/normalize'

interface CommLogProps {
  events: CommunicationEvent[]
}

export function CommLog({ events }: CommLogProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('All')

  const { announcements, winners, vehicleStatus } = useMemo(
    () => parseCommunicationEvents(events),
    [events]
  )

  const allVehicles = useMemo(() => {
    const vehicles = new Set<string>()
    announcements.forEach(a => {
      if (a.from) vehicles.add(a.from)
      if (a.to) vehicles.add(a.to)
    })
    winners.forEach(w => {
      if (w.from) vehicles.add(w.from)
      if (w.to) vehicles.add(w.to)
      if (w.winner) vehicles.add(w.winner)
      if (w.best_holder) vehicles.add(w.best_holder)
    })
    vehicleStatus.forEach(v => {
      if (v.vehicle) vehicles.add(v.vehicle)
    })
    return Array.from(vehicles).sort()
  }, [announcements, winners, vehicleStatus])

  const filterRows = <T extends Record<string, any>>(
    rows: T[],
    keys: (keyof T)[]
  ): T[] => {
    if (selectedVehicle === 'All') return rows
    return rows.filter(r => keys.some(k => r[k] === selectedVehicle))
  }

  const filteredAnnouncements = filterRows(announcements, ['from', 'to'])
  const filteredWinners = filterRows(winners, ['from', 'to', 'winner', 'best_holder'])
  const filteredStatus = filterRows(vehicleStatus, ['vehicle'])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Vehicle Filter</label>
            <Select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full md:w-64"
            >
              <option value="All">All</option>
              {allVehicles.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAnnouncements.length === 0 ? (
            <p className="text-muted-foreground">None</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">From</th>
                    <th className="text-left p-2">To</th>
                    <th className="text-left p-2">Task ID</th>
                    <th className="text-left p-2">Pickup Edge</th>
                    <th className="text-left p-2">Delivery Edge</th>
                    <th className="text-left p-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnnouncements.map((ann, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2">{ann.time}</td>
                      <td className="p-2">{ann.from}</td>
                      <td className="p-2">{ann.to}</td>
                      <td className="p-2">{ann.task_id}</td>
                      <td className="p-2">{ann['pickup.edge']}</td>
                      <td className="p-2">{ann['delivery.edge']}</td>
                      <td className="p-2">{ann.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Winner Decisions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWinners.length === 0 ? (
            <p className="text-muted-foreground">None</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">From</th>
                    <th className="text-left p-2">To</th>
                    <th className="text-left p-2">Task ID</th>
                    <th className="text-left p-2">Winner</th>
                    <th className="text-left p-2">Best Bid</th>
                    <th className="text-left p-2">Best Holder</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWinners.map((win, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2">{win.time}</td>
                      <td className="p-2">{win.from}</td>
                      <td className="p-2">{win.to}</td>
                      <td className="p-2">{win.task_id}</td>
                      <td className="p-2">{win.winner}</td>
                      <td className="p-2">{win.best_bid ?? 'N/A'}</td>
                      <td className="p-2">{win.best_holder ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStatus.length === 0 ? (
            <p className="text-muted-foreground">None</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Vehicle</th>
                    <th className="text-left p-2">Battery</th>
                    <th className="text-left p-2">Current Edge</th>
                    <th className="text-left p-2">Next Edge</th>
                    <th className="text-left p-2">Current Task</th>
                    <th className="text-left p-2">Assigned Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStatus.map((status, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2">{status.time}</td>
                      <td className="p-2">{status.vehicle}</td>
                      <td className="p-2">{status.battery}</td>
                      <td className="p-2">{status.current_edge}</td>
                      <td className="p-2">{status.next_edge}</td>
                      <td className="p-2">{status.current_task ?? 'N/A'}</td>
                      <td className="p-2">{status.assigned_tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

