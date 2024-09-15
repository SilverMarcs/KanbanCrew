import React from "react";
import { useSprints } from "@/hooks/useSprints";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";

const SprintList: React.FC = () => {
  const sprints = useSprints();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sprints.map((sprint) => (
        <Card key={sprint.id}>
          <CardHeader>
            <CardTitle className="text-xl">{sprint.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <StatusBadge status={sprint.status} />
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Start Date:</span>{" "}
              {sprint.startDate.toDate().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">End Date:</span>{" "}
              {sprint.endDate.toDate().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SprintList;
