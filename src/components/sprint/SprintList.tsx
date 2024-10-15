import { useSprints } from "@/hooks/useSprints";
import { CreateSprintCard } from "./CreateSprintCard";
import SprintCard from "./SprintCard";
import { AnimatePresence, motion } from "framer-motion";

const SprintList: React.FC = () => {
  const sprints = useSprints();

  // Sort sprints by startDate
  const sortedSprints = sprints.sort(
    (a, b) => a.startDate.toMillis() - b.startDate.toMillis()
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-20">
        <h1 className="text-5xl font-bold">Sprints</h1>
      </div>

      <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
        {sortedSprints.map((sprint) => (
          <div
            key={sprint.id}

          >
            <SprintCard sprint={sprint} />
          </div>
        ))}
        <CreateSprintCard />
      </div>
    </div>
  );
};

export default SprintList;
