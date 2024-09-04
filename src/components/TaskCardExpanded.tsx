import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/models/Task";
import { Tag } from "@/models/Tag";
import { TagBadge } from "@/components/TagBadge";
import { TagDropdown } from "./TagDropdown";
import { useState } from "react";
import { PriorityDropdown } from "./PriorityDropdown";
import { Priority } from "@/models/Priority";
import HistoryLog from "@/components/HistoryLog";

export const TaskCardExpanded = ({
  id,
  title,
  storyPoints,
  priority: initialPriority,
  avatarUrl,
  tags,
  description,
  projectStage,
  status,
  type,
  assignee,
}: Task) => {
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);

  return (
    <div className="text-start px-3">
      <div className="w-full flex items-center space-x-2">
        <PriorityDropdown
          priority={priority}
          setPriority={setPriority}
          taskId={id}
        />
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
      <div className="mt-20 flex justify-between items-center">
        <div className="flex space-x-3 items-center">
          <p className="font-semobold text-gray-600">Project stage</p>
          <p className="font-bold">{projectStage}</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedTags.map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
          <TagDropdown
            selectedTags={selectedTags}
            onTagChange={setSelectedTags}
            taskId={id}
          />
        </div>
      </div>
    </div>
  );
};
