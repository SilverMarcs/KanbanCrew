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

// Exporting union type for use in other modules
export type TaskOrSprintStatus = Status | SprintStatus.NotStarted | SprintStatus.Active | SprintStatus.Done;

interface TaskStatusDropdownProps {
  status: TaskOrSprintStatus;
  setStatus: (status: TaskOrSprintStatus) => void;
  taskId?: string;
  isSprint?: boolean; // For handling sprints 
}

export function TaskStatusDropdown({
  status,
  setStatus,
  taskId,
  isSprint = false, // Default to false for tasks
}: TaskStatusDropdownProps) {
  // Type guard for SprintStatus
  const isSprintStatus = (value: TaskOrSprintStatus): value is SprintStatus => {
    return Object.values(SprintStatus).includes(value as SprintStatus);
  };

  // Type guard for Status
  const isTaskStatus = (value: TaskOrSprintStatus): value is Status => {
    return Object.values(Status).includes(value as Status);
  };

  const handleStatusChange = async (value: string) => {
    if (isSprintStatus(status) && status === SprintStatus.Done) {
      return; // Disallow changes if the sprint is done
    } else if (!isSprintStatus(status) && status === Status.Completed) {
      return; // Disallow changes if the task is completed
    }

    let newStatus: TaskOrSprintStatus;

    if (isSprint) {
      newStatus = value as SprintStatus; // Ensure value is a SprintStatus
    } else {
      newStatus = value as Status; // Otherwise, ensure value is a Status
    }

    if (isSprint && isSprintStatus(newStatus)) {
      setStatus(newStatus);
    } else if (!isSprint && isTaskStatus(newStatus)) {
      setStatus(newStatus);
    }

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
        <Button
          className="bg-transparent font-bold hover:bg-transparent text-black flex items-center"
          disabled={status === SprintStatus.Done || status === Status.Completed} // Disable dropdown if status is "Done"
        >
          <StatusBadge status={status} />
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
          {/* Rendering Status or SprintStatus based on isSprint prop */}
          {isSprint ? (
            <>
              <DropdownMenuRadioItem value={SprintStatus.NotStarted} disabled={status === SprintStatus.Done}>
                {SprintStatus.NotStarted}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={SprintStatus.Active} disabled={status === SprintStatus.Done}>
                {SprintStatus.Active}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={SprintStatus.Done} disabled={status === SprintStatus.Done}>
                {SprintStatus.Done}
              </DropdownMenuRadioItem>
            </>
          ) : (
            <>
              <DropdownMenuRadioItem value={Status.NotStarted} disabled={status === Status.Completed}>
                {Status.NotStarted}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={Status.InProgress} disabled={status === Status.Completed}>
                {Status.InProgress}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={Status.Completed} disabled={status === Status.Completed}>
                {Status.Completed}
              </DropdownMenuRadioItem>
            </>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}