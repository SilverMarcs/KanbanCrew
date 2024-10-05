"use client";

import SprintBacklog from "@/components/sprint/SprintBacklog";
import { useSprints } from "@/hooks/useSprints";

const SprintBacklogPage = ({ params }: { params: { sprint_id: string } }) => {
  const sprints = useSprints();

  const selectedSprint = sprints.find(
    (sprint) => sprint.id === params.sprint_id
  );

  if (!selectedSprint) return <div>Loading...</div>;

  return (
    <div className="p-16">
      <h1 className="text-5xl font-bold mb-8">{selectedSprint.name} Backlog</h1>
      <SprintBacklog sprint={selectedSprint} />
    </div>
  );
};

export default SprintBacklogPage;
