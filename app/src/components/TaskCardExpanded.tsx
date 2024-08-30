import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TaskCardProps } from "./TaskCard";
import { getTagColor, getPriorityColor } from "@/lib/utils";

export const TaskCardExpanded = ({
  index,
  title,
  storyPoints,
  priority,
  avatarUrl,
  tag,
}: TaskCardProps) => {
  const { bgColor, textColor } = getTagColor(tag);
  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(priority);

  return (
    <div className="relative rounded-xl">
      <div className="text-start mt-6">
        <div className="w-full flex space-x-2">
          <p
            className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-sm font-bold`}
          >
            {priority}
          </p>
          <div
            className={`${bgColor} ${textColor} py-2 px-4 rounded-3xl text-xs font-bold bottom-3 right-3`}
          >
            {tag}
          </div>
        </div>
        <div className="text-3xl text-black font-bold mt-2">{title}</div>
        <div className="text-gray-500">Story point - {storyPoints}</div>
        <Avatar className="mt-6">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};
