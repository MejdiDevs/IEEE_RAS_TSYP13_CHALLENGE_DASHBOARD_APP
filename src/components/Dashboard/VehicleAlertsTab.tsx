import { useData } from "@/contexts/DataContext";
import { greedyAllocation, computeVehicleAlerts } from "@/lib/allocation";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";

export function VehicleAlertsTab() {
  const { vehicles, tasks } = useData();
  const assignments = greedyAllocation(vehicles, tasks);
  const alerts = computeVehicleAlerts(vehicles, tasks, assignments);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  if (alerts.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground font-inter">No alerts</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-orbitron text-xl font-bold mb-4">Vehicle Alerts</h3>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <th className="text-left">Vehicle</th>
              <th className="text-left">Severity</th>
              <th className="text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index}>
                <td className="font-medium">{alert.Vehicle}</td>
                <td>
                  <Badge className={getSeverityColor(alert.Severity)}>
                    {alert.Severity}
                  </Badge>
                </td>
                <td>{alert.Message}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

