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
import { ChevronDown } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Status } from "@/models/Status";
import { SprintStatus } from "@/models/sprints/SprintStatus";
import { StatusBadge } from "@/components/StatusBadge";

// exporting union type so we can use it in other modules
export type TaskOrSprintStatus = Status | SprintStatus;

interface TaskStatusDropdownProps {
  status: TaskOrSprintStatus;
  setStatus: (status: TaskOrSprintStatus) => void;
  taskId?: string;
  isSprint?: boolean; // for handling sprints 
}

export function TaskStatusDropdown({
  status,
  setStatus,
  taskId,
  isSprint = false, // default to false for tasks
}: TaskStatusDropdownProps) {
  const handleStatusChange = async (value: string) => {
    const newStatus = isSprint
      ? (value as SprintStatus)
      : (value as Status);
    setStatus(newStatus);

    // If a taskId is provided, update the status in Firestore
    if (taskId) {
      await updateTaskStatus(taskId, newStatus);
    }
  };

  // Update Firestore task status
  const updateTaskStatus = async (taskId: string, status: TaskOrSprintStatus) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent font-bold hover:bg-transparent text-black flex items-center">
          <StatusBadge status={status} />
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
          {/* rendering Status or SprintStatus based on isSprint prop */}
          {isSprint ? (
            <>
              <DropdownMenuRadioItem value={SprintStatus.NotStarted}>
                {SprintStatus.NotStarted}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={SprintStatus.Active}>
                {SprintStatus.Active}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={SprintStatus.Done}>
                {SprintStatus.Done}
              </DropdownMenuRadioItem>
            </>
          ) : (
            <>
              <DropdownMenuRadioItem value={Status.NotStarted}>
                {Status.NotStarted}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={Status.InProgress}>
                {Status.InProgress}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={Status.Completed}>
                {Status.Completed}
              </DropdownMenuRadioItem>
            </>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
