import { useData } from "@/contexts/DataContext";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

export function DataTab() {
  const { vehicles, tasks } = useData();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-4">Vehicles</h3>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Capacity</th>
                <th className="text-left">Energy Capacity</th>
                <th className="text-left">Location (lon, lat)</th>
                <th className="text-left">Speed</th>
                <th className="text-left">Type</th>
                <th className="text-left">Capabilities</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="font-medium">{v.id}</td>
                  <td>{v.capacity}</td>
                  <td>{v.energy_capacity}</td>
                  <td>
                    [{v.location[0].toFixed(1)}, {v.location[1].toFixed(1)}]
                  </td>
                  <td>{v.speed}</td>
                  <td>{v.vehicle_type}</td>
                  <td>{v.capabilities.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-4">Tasks</h3>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Priority</th>
                <th className="text-left">Demand</th>
                <th className="text-left">Location</th>
                <th className="text-left">Time Window</th>
                <th className="text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium">T{t.id}</td>
                  <td>{t.priority}</td>
                  <td>{t.demand}</td>
                  <td>
                    [{t.location[0].toFixed(1)}, {t.location[1].toFixed(1)}]
                  </td>
                  <td>
                    [{t.time_window[0]}, {t.time_window[1]}]
                  </td>
                  <td>{t.task_type}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

