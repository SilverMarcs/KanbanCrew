import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Sprint } from "@/models/sprints/Sprint";

interface SprintCardProps {
  sprint: Sprint;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => {
  return (
    <Card
      key={sprint.id}
      className="flex items-center w-full bg-yellow-200 outline-none border-0 rounded-xl"
    >
      <div className="px-16 py-4 flex space-x-16 items-center">
        <div className="text-xl font-extrabold">{sprint.name}</div>
        <div className="font-bold">
          <StatusBadge status={sprint.status} />
        </div>
        <p className="text-sm text-gray-600">
          {sprint.startDate.toDate().toLocaleDateString()} -{" "}
          {sprint.endDate.toDate().toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
};

export default SprintCard;
