import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/models/Task";
import { getTagColor, Tag } from "@/models/Tag";
import { getPriorityColor } from "@/models/Priority";
import { TagBadge } from "@/components/TagBadge";
import { DropdownTag } from "./TagDropdown";
import { useState } from "react";

export const TaskCardExpanded = ({
  title,
  storyPoints,
  priority,
  avatarUrl,
  tags,
  description,
  projectStage,
  status,
  type,
  assignee,
}: Task) => {
  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(priority);

    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)

  return (
    <div className="text-start px-3">
      <div className="w-full flex space-x-2">
        <div
          className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-xs font-bold`}
        >
          {priority}
        </div>
        <div className="flex space-x-2">
            {tags.map((tag,i) => (
              <TagBadge key={i} tag={tag} />
            ))}
          </div>
        <DropdownTag selectedTags={selectedTags} onTagChange={setSelectedTags} />
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
