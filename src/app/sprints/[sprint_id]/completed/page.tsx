"use client";

import CompletedSprint from "../../CompletedSprint";
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
    <div className="flex flex-col items-center space-y-12 w-full mt-12">
      <h1 className="uppercase text-5xl">Completed Sprint</h1>
      <CompletedSprint sprint={selectedSprint} tasks={sprintTasks} />
    </div>
  );
};

export default CompletedSprintPage;
