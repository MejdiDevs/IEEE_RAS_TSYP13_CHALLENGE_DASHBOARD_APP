import { VehicleAlert, TaskNotification, Task } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

interface AlertsAndNotificationsProps {
  alerts: VehicleAlert[]
  notifications: TaskNotification[]
  unallocatedTasks: Task[]
}

export function AlertsAndNotifications({
  alerts,
  notifications,
  unallocatedTasks
}: AlertsAndNotificationsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-400'
      case 'Medium':
        return 'text-yellow-400'
      default:
        return 'text-blue-400'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High':
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case 'Medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground">No alerts</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  {getSeverityIcon(alert.Severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{alert.Vehicle}</span>
                      <span className={`text-sm ${getSeverityColor(alert.Severity)}`}>
                        {alert.Severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.Message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Task</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Urgency</th>
                  <th className="text-left p-2">Window Start</th>
                  <th className="text-left p-2">Window End</th>
                  <th className="text-left p-2">Notification</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((note, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-2">{note.Task}</td>
                    <td className="p-2">{note.Priority}</td>
                    <td className={`p-2 ${getSeverityColor(note.Urgency)}`}>
                      {note.Urgency}
                    </td>
                    <td className="p-2">{note['Window Start']}</td>
                    <td className="p-2">{note['Window End']}</td>
                    <td className="p-2">{note.Notification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unallocated Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {unallocatedTasks.length === 0 ? (
            <p className="text-muted-foreground">All tasks allocated</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Priority</th>
                    <th className="text-left p-2">Demand</th>
                    <th className="text-left p-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {unallocatedTasks.map(task => (
                    <tr key={task.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">{task.id}</td>
                      <td className="p-2">{task.priority}</td>
                      <td className="p-2">{task.demand}</td>
                      <td className="p-2">
                        [{task.location[0].toFixed(1)}, {task.location[1].toFixed(1)}]
                      </td>
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

