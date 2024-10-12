import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/models/Member";

interface UserAvatarProps {
  member: Member;
  showName?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  member,
  showName = false,
  size = "md", // Default size if not specified
}) => {
  const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;

  // Define size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };

  return (
    <div className="flex items-center">
      <Avatar className={sizeClasses[size]}>
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
