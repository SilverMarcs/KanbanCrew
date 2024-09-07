import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Pencil } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Status } from "@/models/Status"

export function TaskStatusDropdown({
  status,
  setStatus,
  taskId,
}: {
  status: Status;
  setStatus: (status: Status) => void;
  taskId?: string; // Make taskId optional
}) {
  const handleStatusChange = async (value: string) => {
    const newStatus = value as Status;
    setStatus(newStatus);

    if (taskId) {
      // Only update Firebase if taskId is provided
      await updateTaskStatus(taskId, newStatus);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Status) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-1 w-21 bg-transparent font-bold hover:bg-transparent text-black">
            {status}
            <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
          <DropdownMenuRadioItem value={Status.NotStarted}>Not Started</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.InProgress}>In Progress</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.Completed}>Completed</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}