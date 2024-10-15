import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Member } from "@/models/Member";
import { useMembers } from "@/hooks/useMembers";
import { UserAvatar } from "../../UserAvatar";

interface AssigneeFieldProps {
  assignee: Member;
  setAssignee: (newAssignee: Member) => void;
  taskId?: string;
  disabled?: boolean;
}

export const AssigneeField = ({
  assignee,
  setAssignee,
  taskId,
  disabled = false,
}: AssigneeFieldProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const members = useMembers();

  const handleAssigneeChange = async (newAssignee: Member) => {
    if (disabled) return; // Prevent changes if disabled
    setAssignee(newAssignee);
    setIsDropdownOpen(false);

    if (taskId) {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, {
          assignee: doc(db, "members", newAssignee.id),
        });
      } catch (error) {
        console.error("Error updating assignee in Firebase:", error);
      }
    }
  };

  return (
    <div>
      <p className="text-muted-foreground font-semibold mt-6 text-sm">
        Assignee
      </p>
      <div className="flex space-x-2 w-full items-center">
        <DropdownMenu
          open={isDropdownOpen && !disabled}
          onOpenChange={setIsDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <div
              className={`flex space-x-2 items-center rounded-lg py-2 px-2 ${
                disabled
                  ? ""
                  : "cursor-pointer hover:bg-accent/50 hover:text-accent-foreground transition-all"
              }`}
              onClick={() => !disabled && setIsDropdownOpen(true)} // Prevent dropdown opening if disabled
            >
              <UserAvatar member={assignee} showName />
            </div>
          </DropdownMenuTrigger>

          {!disabled && (
            <DropdownMenuContent align="start">
              {members.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => handleAssigneeChange(member)}
                >
                  <UserAvatar member={member} showName />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
};
