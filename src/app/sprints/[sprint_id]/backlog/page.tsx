"use client";

import SprintBacklog from "../../SprintBacklog";
import { useSprints } from "@/hooks/useSprints";

const SprintBacklogPage = ({ params }: { params: { sprint_id: string } }) => {
  const sprints = useSprints();

  const selectedSprint = sprints.find(
    (sprint) => sprint.id === params.sprint_id
  );

  if (!selectedSprint) return <div>Loading...</div>;

  return <SprintBacklog sprint={selectedSprint} />;
};

export default SprintBacklogPage;
