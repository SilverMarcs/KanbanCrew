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
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export function TaskPriorityField({
  priority,
  setPriority,
  taskId,
  disabled = false,
}: {
  priority: Priority;
  setPriority: (priority: Priority) => void;
  taskId?: string;
  disabled?: boolean;
}) {
  const handlePriorityChange = async (value: string) => {
    const newPriority = value as Priority;
    setPriority(newPriority);

    if (taskId) {
      // Only update Firebase if taskId is provided
      await updateTaskPriority(taskId, newPriority);
    }
  };

  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(priority);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${priorityBgColor} ${priorityTextColor} font-bold hover:${priorityBgColor} hover:${priorityTextColor} ${
            disabled ? "cursor-default" : "cursor-pointer"
          }`}
        >
          {priority}

          {!disabled && <ChevronDown className="ml-1 w-5 h-5" />}
        </Button>
      </DropdownMenuTrigger>

      {/* Disable the entire DropdownMenuContent when disabled */}
      {!disabled && (
        <DropdownMenuContent>
          <DropdownMenuLabel>Task Priority</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={priority}
            onValueChange={handlePriorityChange}
          >
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
      )}
    </DropdownMenu>
  );
}

const updateTaskPriority = async (taskId: string, newPriority: Priority) => {
  const taskRef = doc(db, "tasks", taskId);

  try {
    await updateDoc(taskRef, {
      priority: newPriority,
    });
  } catch (error) {
    console.error("Error updating priority:", error);
  }
};
