import React from "react";
import {
  SprintStatus,
  getSprintStatusColor,
} from "@/models/sprints/SprintStatus";

interface SprintStatusBadgeProps {
  status: SprintStatus;
}

export const SprintStatusBadge: React.FC<SprintStatusBadgeProps> = ({
  status,
}) => {
  return (
    <div className="flex items-center">
      <div
        className="w-2 h-2 rounded-full inline-block mr-2"
        style={{ backgroundColor: getSprintStatusColor(status) }}
      />
      <span>{status}</span>
    </div>
  );
};
