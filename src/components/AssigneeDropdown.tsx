import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface AssigneeDropdownProps {
  assignee: Member | null;
  setAssignee: (newAssignee: Member) => void;
  taskId?: string;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const AssigneeDropdown = ({
  assignee,
  setAssignee,
  taskId,
}: AssigneeDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);
      const membersData = membersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { firstName: string; lastName: string }),
      }));
      setMembers(membersData);
    };

    fetchMembers();
  }, []);

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
      <div className="mt-2 flex space-x-2 w-full items-center">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <div
              className="cursor-pointer flex space-x-2 items-center rounded hover:outline hover:outline-12 hover:outline-black-700"
              onClick={() => setIsDropdownOpen(true)}
            >
              <Avatar>
                <AvatarFallback>
                  {assignee &&
                    getInitials(assignee.firstName, assignee.lastName)}
                </AvatarFallback>
              </Avatar>
              <p className="font-semibold">
                {assignee
                  ? `${assignee.firstName} ${assignee.lastName}`
                  : "No Assignee"}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {members.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onClick={() => handleAssigneeChange(member)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>
                    {getInitials(member.firstName, member.lastName)}
                  </AvatarFallback>
                </Avatar>
                {`${member.firstName} ${member.lastName}`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
