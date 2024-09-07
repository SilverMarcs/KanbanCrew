import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserPen } from "lucide-react";
import { useState } from "react";

interface AssigneeDropdownProps {
  assignee: string;
  onAssigneeChange: (newAssignee: string) => void;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const AssigneeDropdown = ({ assignee, onAssigneeChange }: AssigneeDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const members = [
    { firstName: "Sahab", lastName: "Ul Ferdous" },
    { firstName: "Zabir", lastName: "Zahir" },
    { firstName: "Hiba", lastName: "Zaman" }
  ];

  // Find the current assignee in the hardcoded members array
  const currentAssignee = members.find(member => `${member.firstName} ${member.lastName}` === assignee) || members[0];

  return (
    <div className="mt-2 flex space-x-2 w-full items-center">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className="cursor-pointer flex space-x-2 items-center p-2 rounded hover:outline hover:outline-2 hover:outline-[#E02D2D]"
            onClick={() => setIsDropdownOpen(true)} // Trigger dropdown on click anywhere on this area
          >
            <Avatar>
              <AvatarFallback>{getInitials(currentAssignee.firstName, currentAssignee.lastName)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold">{`${currentAssignee.firstName} ${currentAssignee.lastName}`}</p>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {members.map((member) => (
            <DropdownMenuItem 
              key={member.firstName + member.lastName}
              onClick={() => {
                onAssigneeChange(`${member.firstName} ${member.lastName}`);
                setIsDropdownOpen(false);
              }}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
              </Avatar>
              {`${member.firstName} ${member.lastName}`}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" className="pointer-events-none">
        <UserPen className="h-4 w-4" />
      </Button>
    </div>
  );
};
