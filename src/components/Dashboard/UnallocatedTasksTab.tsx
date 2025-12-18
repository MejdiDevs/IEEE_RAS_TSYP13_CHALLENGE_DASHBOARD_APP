import { useData } from "@/contexts/DataContext";
import { greedyAllocation, getUnallocatedTasks } from "@/lib/allocation";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";

export function UnallocatedTasksTab() {
  const { vehicles, tasks } = useData();
  const assignments = greedyAllocation(vehicles, tasks);
  const unallocated = getUnallocatedTasks(tasks, assignments);

  if (unallocated.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground font-inter">All tasks are allocated.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-orbitron text-xl font-bold mb-4">Unallocated Tasks</h3>
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
            {unallocated.map((task) => (
              <tr key={task.id}>
                <td className="font-medium">T{task.id}</td>
                <td>{task.priority}</td>
                <td>{task.demand}</td>
                <td>
                  [{task.location[0].toFixed(1)}, {task.location[1].toFixed(1)}]
                </td>
                <td>
                  [{task.time_window[0]}, {task.time_window[1]}]
                </td>
                <td>{task.task_type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  );
}

