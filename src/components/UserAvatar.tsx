import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/models/Member";

interface UserAvatarProps {
  member: Member;
  showName?: boolean; // New prop to conditionally show the name
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  member,
  showName = false,
}) => {
  const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;

  return (
    <div className="flex items-center">
      <Avatar>
        <AvatarImage
          src={member.avatarUrl}
          alt={`${member.firstName} ${member.lastName}`}
          onError={(e) => console.error("Error loading image:", e)}
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {showName && (
        <span className="ml-2 font-semibold">
          {member.firstName} {member.lastName}
        </span>
      )}
    </div>
  );
};
