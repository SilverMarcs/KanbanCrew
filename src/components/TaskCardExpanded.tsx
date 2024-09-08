import React from "react";
import { Task } from "@/models/Task";
import { Tag } from "@/models/Tag";
import { TagBadge } from "@/components/TagBadge";
import { TagDropdown } from "./TagDropdown";
import { useState } from "react";
import { PriorityDropdown } from "./PriorityDropdown";
import { Priority } from "@/models/Priority";
import HistoryLogs from "@/components/HistoryLogs";
import DeleteButton from "@/components/DeleteButton";
import { DescriptionEditable } from "@/components//DescriptionEditable";
import { TitleEditable } from "@/components//TitleEditable";
import { StoryPointsField } from "@/components//StoryPointsField";
import { TaskTypePicker } from "@/components/TaskTypePicker";
import { Type } from "@/models/Type";
import { ProjectStagesDropdown } from "@/components/ProjectStagesDropdown";
import { ProjectStage } from "@/models/ProjectStage";
import { TaskStatusDropdown } from "@/components/TaskStatusDropdown";
import { Status } from "@/models/Status";
import { Member } from "@/models/Member";
import { AssigneeDropdown } from "@/components/AssigneeDropdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TaskCardExpandedProps extends Task {
  closeDialog?: () => void;
  members: Member[];
}

export const TaskCardExpanded = ({
  id,
  title: initialTitle,
  storyPoints: initialStoryPoints,
  priority: initialPriority,
  avatarUrl,
  tags,
  description: initialDescription,
  projectStage: initialProjectStage,
  status: initialStatus = Status.NotStarted,
  type,
  assignee: initialAssignee,
  closeDialog,
  historyLogs,
  members,
}: TaskCardExpandedProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [storyPoints, setStoryPoints] = useState(initialStoryPoints);
  const [priority, setPriority] = useState<Priority>(initialPriority);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const [taskType, setTaskType] = useState<Type>(type);
  const [projectStage, setProjectStage] =
    useState<ProjectStage>(initialProjectStage);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [description, setDescription] = useState(initialDescription);
  const [assignee, setAssignee] = useState<Member | null>(initialAssignee);

  return (
    <div className="px-3">
      <div className="flex">
        <div className="text-start">
          <div className="flex space-x-3">
            <PriorityDropdown
              priority={priority}
              setPriority={setPriority}
              taskId={id}
            />
            <TaskTypePicker
              taskId={id}
              currentType={taskType}
              setTaskType={setTaskType}
            />
          </div>
          <div className="mt-1">
            <TitleEditable title={title} taskId={id} setTitle={setTitle} />
          </div>
          <div className="flex items-center space-x-1">
            <StoryPointsField
              storyPoints={storyPoints}
              taskId={id}
              setStoryPoints={setStoryPoints}
            />
            <TaskStatusDropdown
              status={status}
              setStatus={setStatus}
              taskId={id}
            />
          </div>
          <AssigneeDropdown
            assignee={assignee}
            setAssignee={setAssignee}
            taskId={id}
          />
          <DescriptionEditable
            description={description}
            taskId={id}
            setDescription={setDescription}
          />
        </div>
        <div className="mt-14">
          <HistoryLogs historyLogs={historyLogs} members={members} />
        </div>
      </div>
      <div>
        <div className="mt-20 flex justify-between items-center">
          <ProjectStagesDropdown
            projectStage={projectStage}
            setProjectStage={setProjectStage}
            taskId={id}
          />
          <div className="flex items-center space-x-2 justify-end">
            <ScrollArea className="w-96 whitespace-nowrap rounded-md">
              <div className="flex w-full space-x-2 p-4 justify-end">
                {selectedTags.map((tag, i) => (
                  <TagBadge key={i} tag={tag} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
