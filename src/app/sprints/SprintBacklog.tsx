import { useEffect, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Sprint } from "@/models/sprints/Sprint";
import { TaskCard } from "@/components/TaskCard";
import { Task } from "@/models/Task";

interface SprintBacklogProps {
  sprint: Sprint;
}

const SprintBacklogView: React.FC<SprintBacklogProps> = ({ sprint }) => {
  const tasks = useTasks();
  const [productBacklog, setProductBacklog] = useState<Task[]>([]);
  const [sprintBacklog, setSprintBacklog] = useState<Task[]>([]);

  useEffect(() => {
    const sprintTaskIds = new Set(sprint.tasks?.map((ref) => ref.id) || []);
    setSprintBacklog(tasks.filter((task) => sprintTaskIds.has(task.id)));
    setProductBacklog(
      tasks.filter((task) => !sprintTaskIds.has(task.id) && !task.sprint)
    );
  }, [tasks, sprint]);

  return (
    <div className="flex space-x-4 mt-8">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Product Backlog</h2>
        {productBacklog.map((task) => (
          <TaskCard key={task.id} task={task} members={[]} />
        ))}
      </div>
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Sprint Backlog</h2>
        {sprintBacklog.map((task) => (
          <TaskCard key={task.id} task={task} members={[]} />
        ))}
      </div>
    </div>
  );
};

export default SprintBacklogView;
