import React from "react";
import { Status, getStatusColor } from "@/models/Status";
import { SprintStatus, getSprintStatusColor } from "@/models/sprints/SprintStatus";

type StatusOrSprintStatus = Status | SprintStatus;

interface StatusBadgeProps {
  status: StatusOrSprintStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getColor = (status: StatusOrSprintStatus) => {
    if (Object.values(Status).includes(status as Status)) {
      return getStatusColor(status as Status);
    } else if (Object.values(SprintStatus).includes(status as SprintStatus)) {
      return getSprintStatusColor(status as SprintStatus);
    }
    return "#000"; 
  };

  return (
    <div className="flex items-center">
      <div
        className="w-2 h-2 rounded-full inline-block mr-2"
        style={{ backgroundColor: getColor(status) }}
      />
      <span>{status}</span>
    </div>
  );
};
