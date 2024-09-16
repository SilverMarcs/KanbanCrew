import React from "react";
import { useSprints } from "@/hooks/useSprints";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";

const SprintList: React.FC = () => {
  const sprints = useSprints();

  return (
    <div className="flex flex-col space-y-4 my-4">
      {sprints.map((sprint) => (
        <Card
          key={sprint.id}
          className="flex items-center w-full bg-yellow-200 outline-none border-0"
        >
          <div className="px-16 py-4 flex space-x-16 items-center">
            <div className="text-xl font-bold">{sprint.name}</div>
            <div className="font-bold">
              <StatusBadge status={sprint.status} />
            </div>
            <p className="text-sm text-gray-600">
              {sprint.startDate.toDate().toLocaleDateString()} -{" "}
              {sprint.endDate.toDate().toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SprintList;
