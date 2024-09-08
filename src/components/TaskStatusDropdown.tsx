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

export function TaskStatusDropdown({
  status,
  setStatus,
  taskId,
}: {
  status: Status;
  setStatus: (status: Status) => void;
  taskId?: string;
}) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.NotStarted:
        return "#FF6E6E";
      case Status.InProgress:
        return "#FFA500";
      case Status.Completed:
        return "#34CB5E";
    }
  };

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent font-bold hover:bg-transparent text-black flex items-center">
          <div
            className="w-2 h-2 rounded-full inline-block mr-2"
            style={{ backgroundColor: getStatusColor(status) }}
          />
          {status}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={handleStatusChange}
        >
          <DropdownMenuRadioItem value={Status.NotStarted}>
            {Status.NotStarted}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.InProgress}>
            {Status.InProgress}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Status.Completed}>
            {Status.Completed}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
