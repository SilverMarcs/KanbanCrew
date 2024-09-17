import { useSprints } from "@/hooks/useSprints";
import { CreateSprintCard } from "./CreateSprintCard";
import SprintCard from "./SprintCard";

const SprintList: React.FC = () => {
  const sprints = useSprints();

  return (
    <div className="flex flex-col space-y-4 my-4">
      {sprints.map((sprint) => (
        <SprintCard key={sprint.id} sprint={sprint} />
      ))}
      <CreateSprintCard />
    </div>
  );
};

export default SprintList;
