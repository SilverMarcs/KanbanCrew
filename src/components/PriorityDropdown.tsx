import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Priority } from "@/models/Priority";
import { ChevronDown } from "lucide-react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export function DropdownPriority({
  priority,
  setPriority,
}: {
  priority: Priority;
  setPriority: (priority: Priority) => void;
}) {
  const handlePriorityChange = (newPriority: Priority) => {
    setPriority(newPriority);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="bg-transparent hover:bg-gray-100 border-gray-300 hover:border-gray-400 transition-colors">
          <ChevronDown className="h-4 w-4 text-black"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Task Priority</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={priority === Priority.Important}
          onCheckedChange={() => handlePriorityChange(Priority.Important)}
        >
          Important
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priority === Priority.Urgent}
          onCheckedChange={() => handlePriorityChange(Priority.Urgent)}
        >
          Urgent
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={priority === Priority.Low}
          onCheckedChange={() => handlePriorityChange(Priority.Low)}
        >
          Low
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
