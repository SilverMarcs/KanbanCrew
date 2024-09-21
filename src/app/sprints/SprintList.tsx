import { useState } from "react";
import { useSprints } from "@/hooks/useSprints";
import { useTasks } from "@/hooks/useTasks";
import { CreateSprintCard } from "./CreateSprintCard";
import SprintCard from "./SprintCard";
import SprintBacklog from "./SprintBacklog";
import KanbanBoard from "./KanbanBoard";
import CompletedSprint from "./CompletedSprint";
import { Sprint } from "@/models/sprints/Sprint";
import { Status } from "@/models/Status";
import { Button } from "@/components/ui/button";

const SprintList: React.FC = () => {
  const sprints = useSprints();
  const allTasks = useTasks();
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  // Sort sprints by startDate
  const sortedSprints = sprints.sort(
    (a, b) => a.startDate.toMillis() - b.startDate.toMillis()
  );

  const handleSprintClick = (sprint: Sprint) => {
    setSelectedSprint(sprint);
  };

  const renderSprintView = () => {
    if (!selectedSprint) return null;

    switch (selectedSprint.status) {
      case Status.NotStarted:
        return <SprintBacklog sprint={selectedSprint} />;
      case Status.InProgress:
        const sprintTasks = allTasks.filter((task) =>
          selectedSprint.taskIds?.includes(task.id)
        );
        return <KanbanBoard tasks={sprintTasks} />;
      case Status.Completed:
        return <CompletedSprint sprint={selectedSprint} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-4 my-4">
      {sortedSprints.map((sprint) => (
        <div key={sprint.id}>
          <Button
            onClick={() => handleSprintClick(sprint)}
            className="bg-transparent w-full h-full hover:bg-transparent p-0"
          >
            <SprintCard sprint={sprint} />
          </Button>
        </div>
      ))}
      <CreateSprintCard />
      {renderSprintView()}
    </div>
  );
};

export default SprintList;
