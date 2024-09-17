import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SprintForm } from "./SprintForm"; // Import the reusable form
import { StatusBadge } from "@/components/StatusBadge";
import { Sprint } from "@/models/sprints/Sprint";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Status } from "@/models/Status";

interface SprintCardProps {
  sprint: Sprint;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (
    name: string,
    status: Status,
    from: Date,
    to: Date
  ) => {
    try {
      console.log(sprint.id);
      const sprintRef = doc(db, "sprints", sprint.id);
      await updateDoc(sprintRef, {
        name: name,
        sprintStatus: status,
        startDate: Timestamp.fromDate(from),
        endDate: Timestamp.fromDate(to),
      });

      toast({
        title: `${name} updated`,
        description: (
          <div>
            <p>Status: {status}</p>
            <p>From: {format(from, "P")}</p>
            <p>To: {format(to, "P")}</p>
          </div>
        ),
      });
      setIsOpen(false);
      console.log("Sprint updated successfully");
    } catch (error) {
      console.error("Error updating sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to update the sprint.",
      });
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full">
          <Card
            key={sprint.id}
            className="flex items-center w-full bg-yellow-200 outline-none border-0 rounded-xl cursor-pointer"
            onClick={() => setIsOpen(true)}
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
        </DialogTrigger>
        <DialogContent className="bg-yellow-200 max-w-lg border-0 shadow-lg">
          <DialogHeader>
            <SprintForm
              initialTitle={sprint.name}
              initialStatus={sprint.status}
              initialStartDate={sprint.startDate.toDate()}
              initialEndDate={sprint.endDate.toDate()}
              onSubmit={onSubmit}
              submitButtonLabel="UPDATE"
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SprintCard;
