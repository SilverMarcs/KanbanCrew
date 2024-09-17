import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { SprintForm } from "./SprintForm"; // Import the reusable form
import { StatusBadge } from "@/components/StatusBadge";
import { Sprint } from "@/models/sprints/Sprint";
import { doc, updateDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Status } from "@/models/Status";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Import the new confirmation dialog

interface SprintCardProps {
  sprint: Sprint;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onSubmit = async (
    name: string,
    status: Status,
    from: Date,
    to: Date
  ) => {
    try {
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
    } catch (error) {
      console.error("Error updating sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to update the sprint.",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const sprintRef = doc(db, "sprints", sprint.id);
      await deleteDoc(sprintRef);

      toast({
        title: `${sprint.name} deleted`,
        description: "The sprint has been deleted from Firebase.",
      });
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to delete the sprint.",
      });
    }
  };

  return (
    <div>
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this sprint? This action cannot be undone."
        confirmButtonLabel="Delete"
        cancelButtonLabel="Cancel"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Card
          key={sprint.id}
          className="flex items-center w-full bg-yellow-200 outline-none border-0 rounded-xl"
        >
          <Button
            className="ml-4 bg-transparent hover:bg-transparent z-50"
            onClick={() => setIsDeleteConfirmOpen(true)} // Open the confirmation dialog
          >
            <Trash2 className="text-red-500" />
          </Button>
          <DialogTrigger className="w-full cursor-pointer">
            <div className="px-6 py-4 flex space-x-16 items-center">
              <div className="text-xl font-extrabold">{sprint.name}</div>
              <div className="font-bold">
                <StatusBadge status={sprint.status} />
              </div>
              <p className="text-sm text-gray-600">
                {sprint.startDate.toDate().toLocaleDateString()} -{" "}
                {sprint.endDate.toDate().toLocaleDateString()}
              </p>
            </div>
          </DialogTrigger>
        </Card>

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
