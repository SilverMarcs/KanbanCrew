"use client";

import CompletedSprint from "@/components/sprint/CompletedSprint";
import { useSprints } from "@/hooks/useSprints";
import { useTasks } from "@/hooks/useTasks";

const CompletedSprintPage = ({ params }: { params: { sprint_id: string } }) => {
  const sprints = useSprints();
  const allTasks = useTasks();

  const selectedSprint = sprints.find(
    (sprint) => sprint.id === params.sprint_id
  );

  const sprintTasks = allTasks.filter((task) =>
    selectedSprint?.taskIds?.includes(task.id)
  );

  if (!selectedSprint) return <div>Loading...</div>;

  return (
    <div className="p-16">
      <h1 className="text-5xl font-bold">Completed Sprint</h1>
      <CompletedSprint sprint={selectedSprint} tasks={sprintTasks} />
    </div>
  );
};

export default CompletedSprintPage;
