import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TaskCardProps } from "./TaskCard";
import { getTagColor, getPriorityColor } from "@/lib/utils";

export const TaskCardExpanded = ({
  title,
  storyPoints,
  priority,
  avatarUrl,
  tag,
  description,
  projectStage,
  status,
  type,
  assignee,
}: TaskCardProps) => {
  const { bgColor, textColor } = getTagColor(tag);
  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(priority);

  return (
    <div className="text-start px-3">
      <div className="w-full flex space-x-2">
        <div
          className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-xs font-bold`}
        >
          {priority}
        </div>
        <div
          className={`${bgColor} ${textColor} py-1 px-4 rounded-3xl text-xs font-bold bottom-3 right-3`}
        >
          {tag}
        </div>
      </div>
      <div className="flex space-x-2 align-middle items-center mt-2">
        <p className="text-3xl text-black font-bold ">{title}</p>
        <p> - {type}</p>
      </div>
      <div className="flex space-x-2">
        <p className="text-gray-500 font-bold">{storyPoints} SP</p>
        <p className="font-bold">- {status}</p>
      </div>
      <p className="text-muted-foreground font-semibold mt-6">Assignee</p>
      <div className="mt-2 flex space-x-2 w-full items-center">
        <Avatar>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="font-semibold">{assignee}</p>
      </div>
      <div className="mt-6">
        <p className="font-bold text-xl">Description</p>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="mt-20 flex space-x-3">
        <p className="font-semobold text-gray-600">Project stage</p>
        <p className="font-bold">{projectStage}</p>
      </div>
    </div>
  );
};
