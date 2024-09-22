import { useSprints } from "@/hooks/useSprints";
import { CreateSprintCard } from "./CreateSprintCard";
import SprintCard from "./SprintCard";

const SprintList: React.FC = () => {
  const sprints = useSprints();

  // Sort sprints by startDate
  const sortedSprints = sprints.sort(
    (a, b) => a.startDate.toMillis() - b.startDate.toMillis()
  );

  return (
    <div className="flex flex-col space-y-4 my-4">
      {sortedSprints.map((sprint) => (
        <div key={sprint.id}>
          <SprintCard sprint={sprint} />
        </div>
      ))}
      <CreateSprintCard />
    </div>
  );
};

export default SprintList;
