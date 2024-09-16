import React from "react";
import { Status, getStatusColor } from "@/models/Status";

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div className="flex items-center">
      <div
        className="w-2 h-2 rounded-full inline-block mr-2"
        style={{ backgroundColor: getStatusColor(status) }}
      />
      <span>{status}</span>
    </div>
  );
};
