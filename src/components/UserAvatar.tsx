import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/models/Member";

interface UserAvatarProps {
  member: Member;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ member }) => {
  const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;

  return (
    <Avatar>
      <AvatarImage
        src={member.avatarUrl}
        alt={`${member.firstName} ${member.lastName}`}
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
