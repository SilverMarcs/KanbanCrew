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
import { SprintStatus } from "@/models/sprints/SprintStatus";
import { SprintStatusBadge } from "./SprintStatusBadge";

export function SprintStatusDropdown({
  status,
  setStatus,
  sprintId,
}: {
  status: SprintStatus;
  setStatus: (status: SprintStatus) => void;
  sprintId?: string;
}) {
  const handleStatusChange = async (value: string) => {
    const newStatus = value as SprintStatus;
    setStatus(newStatus);
    // TODO: this block will never run since we we never call this component with a sprintId
    // the onSubmit prop of sprint form already updates on firestore
    if (sprintId) {
      await updateSprintStatus(sprintId, newStatus);
    }
  };
  const updateSprintStatus = async (sprintId: string, status: SprintStatus) => {
    const taskRef = doc(db, "sprints", sprintId);
    await updateDoc(taskRef, { status });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent font-bold hover:bg-transparent text-black flex items-center">
          {/* <StatusBadge status={status} /> */}
          <SprintStatusBadge status={status} />
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Sprint Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={handleStatusChange}
        >
          <DropdownMenuRadioItem value={SprintStatus.NotStarted}>
            {SprintStatus.NotStarted}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SprintStatus.Active}>
            {SprintStatus.Active}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SprintStatus.Done}>
            {SprintStatus.Done}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
