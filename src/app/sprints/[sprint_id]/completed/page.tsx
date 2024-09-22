"use client";

import CompletedSprint from "../../CompletedSprint";
import { useSprints } from "@/hooks/useSprints";

const CompletedSprintPage = ({ params }: { params: { sprint_id: string } }) => {
  const sprints = useSprints();

  const selectedSprint = sprints.find(
    (sprint) => sprint.id === params.sprint_id
  );

  if (!selectedSprint) return <div>Loading...</div>;

  return <CompletedSprint sprint={selectedSprint} />;
};

export default CompletedSprintPage;
