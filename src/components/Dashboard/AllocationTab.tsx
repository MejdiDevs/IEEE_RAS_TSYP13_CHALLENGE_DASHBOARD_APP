import { useData } from "@/contexts/DataContext";
import { greedyAllocation, computeRouteLengths, computeCost } from "@/lib/allocation";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

export function AllocationTab() {
  const { vehicles, tasks } = useData();
  const assignments = greedyAllocation(vehicles, tasks);
  const routeLengths = computeRouteLengths(vehicles, tasks, assignments);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-4">Allocation Results</h3>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th className="text-left">Vehicle</th>
                <th className="text-left">Capacity</th>
                <th className="text-left">Remaining</th>
                <th className="text-left">Tasks</th>
                <th className="text-left">Route Length</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const taskIds = assignments[v.id] || [];
                return (
                  <tr key={v.id}>
                    <td className="font-medium">{v.id}</td>
                    <td>{v.capacity}</td>
                    <td>{v.remaining_capacity ?? v.capacity}</td>
                    <td>
                      {taskIds.length > 0
                        ? taskIds.map((tid) => `T${tid}`).join(", ")
                        : "None"}
                    </td>
                    <td>{routeLengths[v.id]?.toFixed(1) ?? "0.0"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-orbitron text-xl font-bold mb-4">Cost Matrix</h3>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th className="text-left">Vehicle / Task</th>
                {tasks.map((t) => (
                  <th key={t.id} className="text-left">
                    T{t.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="font-medium">{v.id}</td>
                  {tasks.map((t) => {
                    const cost = computeCost(v, t);
                    return (
                      <td key={t.id}>
                        {cost === -Infinity ? "−∞" : cost.toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

