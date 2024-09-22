import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SprintDetails } from "./SprintDetails";
import { StatusBadge } from "@/components/StatusBadge";
import { Sprint } from "@/models/sprints/Sprint";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/hooks/use-toast";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";

interface SprintCardProps {
  sprint: Sprint;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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
    <div className="w-full">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-1 hover:bg-transparent focus:ring-0 focus:outline-none"
              >
                <EllipsisVertical
                  className="bg-transparent hover:bg-transparent"
                  size={20}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => setIsOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Sprint
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsDeleteConfirmOpen(true)}
                className="text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-full cursor-pointer">
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
          </div>
        </Card>

        <DialogContent className="bg-yellow-200 max-w-lg border-0 shadow-lg">
          <DialogHeader>
            <SprintDetails sprint={sprint} onClose={() => setIsOpen(false)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SprintCard;
