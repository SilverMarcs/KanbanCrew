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
}

export const AssigneeField = ({
  assignee,
  setAssignee,
  taskId,
}: AssigneeFieldProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const members = useMembers();

  const handleAssigneeChange = async (newAssignee: Member) => {
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
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className="cursor-pointer flex space-x-2 items-center rounded-lg hover:bg-accent/50 hover:text-accent-foreground transition-all py-2 px-2"
              onClick={() => setIsDropdownOpen(true)}
            >
              <UserAvatar member={assignee} showName />
            </div>
          </DropdownMenuTrigger>

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
        </DropdownMenu>
      </div>
    </div>
  );
};
