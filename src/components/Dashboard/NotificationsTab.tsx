import { useData } from "@/contexts/DataContext";
import { computeTaskNotifications } from "@/lib/allocation";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export function NotificationsTab() {
  const { tasks } = useData();
  const notifications = computeTaskNotifications(tasks);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-orbitron text-xl font-bold mb-4">Task Notifications</h3>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <th className="text-left">Task</th>
              <th className="text-left">Priority</th>
              <th className="text-left">Urgency</th>
              <th className="text-left">Window Start</th>
              <th className="text-left">Window End</th>
              <th className="text-left">Notification</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((note, index) => (
              <tr key={index}>
                <td className="font-medium">{note.Task}</td>
                <td>{note.Priority}</td>
                <td>
                  <Badge className={getUrgencyColor(note.Urgency)}>
                    {note.Urgency}
                  </Badge>
                </td>
                <td>{note["Window Start"]}</td>
                <td>{note["Window End"]}</td>
                <td>{note.Notification}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

