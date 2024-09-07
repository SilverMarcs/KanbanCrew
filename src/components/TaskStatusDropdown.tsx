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

export function StatusIndicator({ status }: { status: Status }) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.NotStarted:
        return '#FF6E6E';
      case Status.InProgress:
        return '#FFA500';
      case Status.Completed:
        return '#34CB5E';
    }
  };

  return (
    <div 
      className="w-2 h-2 rounded-full inline-block mr-2"
      style={{ backgroundColor: getStatusColor(status) }}
    />
  );
}

export function TaskStatusDropdown({
  status,
  setStatus,
  taskId,
}: {
  status: Status;
  setStatus: (status: Status) => void;
  taskId?: string;
}) {
  const handleStatusChange = async (value: string) => {
    const newStatus = value as Status;
    setStatus(newStatus);

    if (taskId) {
      await updateTaskStatus(taskId, newStatus);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Status) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status });
  };

  const getStatusLabel = (status: Status): string => {
    switch (status) {
      case Status.NotStarted:
        return "Not Started";
      case Status.InProgress:
        return "In Progress";
      case Status.Completed:
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-32 bg-transparent font-bold hover:bg-transparent text-black">
          {getStatusLabel(status)}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
          <DropdownMenuRadioItem value={Status.NotStarted}>
            Not Started
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.InProgress}>
            In Progress
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.Completed}>
            Completed
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
