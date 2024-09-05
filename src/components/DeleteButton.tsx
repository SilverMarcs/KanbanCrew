import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  taskId: string;
  closeDialog: () => void; // Function to close the dialog
  onDelete: (taskId: string) => void; // Callback to remove the task from the UI
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  taskId,
  closeDialog,
  onDelete,
}) => {
  const router = useRouter();

  // Function to handle deletion
  const handleDelete = async () => {
    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await deleteDoc(taskDocRef);
      onDelete(taskId); // Remove the task from the UI
      closeDialog(); // Close the dialog
      router.push("/"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="rounded-full hover:bg-white bg-white">
          <Trash2 size={20} color="red" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to permanently
            delete this task from our servers?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
