import React from "react";
import { Sprint } from "@/models/sprints/Sprint";

interface CompletedSprintProps {
  sprint: Sprint;
}

const CompletedSprint: React.FC<CompletedSprintProps> = ({ sprint }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Completed Sprint: {sprint.name}
      </h2>
      <p>This sprint has been completed. Detailed view coming soon.</p>
    </div>
  );
};

export default CompletedSprint;
