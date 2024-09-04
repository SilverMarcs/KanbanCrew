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
import { getPriorityColor, Priority } from "@/models/Priority";
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

  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(priority);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${priorityBgColor} ${priorityTextColor} flex px-3 rounded-md w-fit text-xs font-bold`}
          >
            {priority}
            <ChevronDown className="ml-2" />
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
