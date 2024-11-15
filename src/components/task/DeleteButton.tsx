import { FC } from "react";
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

// TODO: make this a generic delete button where you pass in delete function
interface DeleteButtonProps {
  taskId: string;
  closeDialog: () => void; // Function to close the dialog
}

const DeleteButton: FC<DeleteButtonProps> = ({ taskId, closeDialog }) => {
  // Function to handle deletion
  const handleDelete = async () => {
    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await deleteDoc(taskDocRef);
      closeDialog(); // Close the dialog
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">
          <Trash2 size={20} color="red" />
        </Button>
      </DialogTrigger>
      <DialogContent>
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
