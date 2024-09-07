import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/models/Task";
import { Tag } from "@/models/Tag";
import { TagBadge } from "@/components/TagBadge";
import { TagDropdown } from "./TagDropdown";
import { useState } from "react";
import { PriorityDropdown } from "./PriorityDropdown";
import { Priority } from "@/models/Priority";
import HistoryLogs from "@/components/HistoryLogs";
import DeleteButton from "@/components/DeleteButton";
import { DescriptionEditable } from "@/components/DescriptionEditable";
import { TitleEditable } from "@/components/TitleEditable";
import { StoryPointsField } from "@/components/StoryPointsField";
import { ProjectStagesDropdown } from "@/components/ProjectStagesDropdown";
import { ProjectStage } from "@/models/ProjectStage";
import { TaskStatusDropdown,StatusIndicator } from "@/components/TaskStatusDropdown";
import { Status } from "@/models/Status";
import { Member } from "@/models/Member";
import { AssigneeDropdown } from "./AssigneeDropdown";

interface TaskCardExpandedProps extends Task {
  closeDialog?: () => void;
  members: Member[];
  onAssigneeChange: (newAssignee: string) => void;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const TaskCardExpanded = ({
  id,
  title,
  storyPoints,
  priority: initialPriority,
  avatarUrl,
  tags,
  description,
  projectStage: initialProjectStage,
  status: initialStatus = Status.NotStarted,
  type,
  assignee,
  closeDialog,
  historyLogs,
  members,
  onAssigneeChange,
}: TaskCardExpandedProps) => {
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const [projectStage, setProjectStage] = useState<ProjectStage>(initialProjectStage);
  const [status, setStatus] = useState<Status>(initialStatus);

  return (
    <div className="px-3">
      <div className="flex">
        <div className="text-start min-w-96">
          <div className="w-full flex items-center space-x-2">
            <PriorityDropdown
              priority={priority}
              setPriority={setPriority}
              taskId={id}
            />
            <div className="flex items-center">
              <p>{type}</p>
            </div>
          </div>
          <div className="my-2">
            <TitleEditable title={title} taskId={id} />
          </div>
          <div className="flex items-center space-x-1">
            <StoryPointsField storyPoints={storyPoints} taskId={id} />
            {/* Add StatusIndicator here */}
            <div className="flex items-center">
              <StatusIndicator status={status} />
              <TaskStatusDropdown
                status={status}
                setStatus={setStatus}
                taskId={id}
              />
            </div>
          </div>
          <p className="text-muted-foreground font-semibold mt-6">Assignee</p>
          <AssigneeDropdown
            assignee={assignee}
            onAssigneeChange={onAssigneeChange}
          />
          <DescriptionEditable description={description} taskId={id} />
        </div>

        <div className="mt-14">
          <HistoryLogs historyLogs={historyLogs} members={members} />
        </div>
      </div>

      <div>
        <div className="mt-20 flex justify-between items-center">
          <div className="flex space-x-3 items-center">
            <p className="font-sembold text-gray-600">Project stage</p>
            <p className="font-bold">
              <ProjectStagesDropdown
                projectStage={projectStage}
                setProjectStage={setProjectStage}
                taskId={id}
              />
            </p>
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
            <DeleteButton taskId={id} closeDialog={closeDialog || (() => {})} />
          </div>
        </div>
      </div>
    </div>
  );
};
