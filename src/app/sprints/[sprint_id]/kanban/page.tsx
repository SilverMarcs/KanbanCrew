"use client";
import KanbanBoard from "../../KanbanBoard";
import { useSprints } from "@/hooks/useSprints";
import { useTasks } from "@/hooks/useTasks";

const KanbanBoardPage = ({ params }: { params: { sprint_id: string } }) => {
  const sprints = useSprints();
  const allTasks = useTasks();

  const selectedSprint = sprints.find(
    (sprint) => sprint.id === params.sprint_id
  );
  const sprintTasks = allTasks.filter((task) =>
    selectedSprint?.taskIds?.includes(task.id)
  );

  if (!selectedSprint) return <div>Loading...</div>;

  return <KanbanBoard tasks={sprintTasks} />;
};

export default KanbanBoardPage;
