"use client";
import Link from "next/link";
import { useSprints } from "@/hooks/useSprints";
import { CreateSprintCard } from "./CreateSprintCard";
import SprintCard from "./SprintCard";
import { Button } from "@/components/ui/button";
import { Sprint } from "@/models/sprints/Sprint";
import { SprintStatus } from "@/models/sprints/SprintStatus";

const SprintList: React.FC = () => {
  const sprints = useSprints();

  const sortedSprints = sprints.sort(
    (a, b) => a.startDate.toMillis() - b.startDate.toMillis()
  );

  const getSprintRoute = (sprint: Sprint) => {
    switch (sprint.status) {
      case SprintStatus.NotStarted:
        return `/sprints/${sprint.id}/backlog`;
      case SprintStatus.Active:
        return `/sprints/${sprint.id}/kanban`;
      case SprintStatus.Done:
        return `/sprints/${sprint.id}/completed`;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col space-y-4 my-4">
      {sortedSprints.map((sprint) => (
        <div key={sprint.id}>
          <Link href={getSprintRoute(sprint)}>
            <Button className="bg-transparent w-full h-full hover:bg-transparent p-0">
              <SprintCard sprint={sprint} />
            </Button>
          </Link>
        </div>
      ))}
      <CreateSprintCard />
    </div>
  );
};

export default SprintList;
