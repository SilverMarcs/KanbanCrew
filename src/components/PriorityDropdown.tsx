import * as React from "react";
import { DropdownMenuRadioItemProps } from "@radix-ui/react-dropdown-menu";
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
import { Priority } from "@/models/Priority";
import { ChevronDown } from "lucide-react";

export function DropdownPriority({
  priority,
  setPriority,
}: {
  priority: Priority;
  setPriority: (priority: Priority) => void;
}) {
  const handlePriorityChange = (value: string) => {
    const newPriority = value as Priority; // Convert string to Priority enum
    setPriority(newPriority);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="h-6 w-6 mt-1 bg-transparent hover:bg-gray-100 border-gray-300 hover:border-gray-400 transition-colors"
        >
          <ChevronDown className="h-4 w-4 text-black" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Task Priority</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={priority} onValueChange={handlePriorityChange}>
          <DropdownMenuRadioItem value={Priority.Important}>
            Important
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Priority.Urgent}>
            Urgent
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={Priority.Low}>
            Low
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
