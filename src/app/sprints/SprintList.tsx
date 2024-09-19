import { useState } from "react";
import { useSprints } from "@/hooks/useSprints";
import { CreateSprintCard } from "./CreateSprintCard";
import SprintCard from "./SprintCard";
import SprintBacklog from "./SprintBacklog";
import { Sprint } from "@/models/sprints/Sprint";
import { Button } from "@/components/ui/button";

const SprintList: React.FC = () => {
  const sprints = useSprints();
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);

  // Sort sprints by startDate
  const sortedSprints = sprints.sort(
    (a, b) => a.startDate.toMillis() - b.startDate.toMillis()
  );

  const handleSprintClick = (sprint: Sprint) => {
    setSelectedSprint(sprint);
  };

  return (
    <div className="flex flex-col space-y-4 my-4">
      {sortedSprints.map((sprint) => (
        <div key={sprint.id}>
          <SprintCard sprint={sprint} />
          <Button
            variant="secondary"
            onClick={() => handleSprintClick(sprint)}
            className=""
          >
            Show Backlog
          </Button>
        </div>
      ))}
      <CreateSprintCard />
      {/* This should be shown in a different page and never here */}
      {selectedSprint && <SprintBacklog sprint={selectedSprint} />}
    </div>
  );
};

export default SprintList;
