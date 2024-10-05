import React from "react";
import { Task } from "@/models/Task";
import { TagDropdown } from "./TagDropdown";
import { useState } from "react";
import { PriorityDropdown } from "./PriorityDropdown";
import HistoryLogs from "@/components/task/HistoryLogs";
import DeleteButton from "@/components/task/DeleteButton";
import { DescriptionEditable } from "@/components/task/DescriptionEditable";
import { TitleEditable } from "@/components/task/TitleEditable";
import { StoryPointsField } from "@/components/task/StoryPointsField";
import { TaskTypePicker } from "@/components//task/TaskTypePicker";
import { ProjectStagesDropdown } from "@/components/task/ProjectStagesDropdown";
import { TaskStatusDropdown } from "@/components/task/TaskStatusDropdown";
import { Member } from "@/models/Member";
import { AssigneeDropdown } from "@/components/task/AssigneeDropdown";
import TimeLogs from "@/components/task/TimeLogs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMembers } from "@/hooks/useMembers";

interface TaskCardExpandedProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  isKanbanBoard?: boolean;
}

export const TaskCardExpanded: React.FC<TaskCardExpandedProps> = ({
  task,
  isOpen,
  onClose,
  isKanbanBoard = false,
}) => {
  const members = useMembers();

  const [title, setTitle] = useState(task.title);
  const [storyPoints, setStoryPoints] = useState(task.storyPoints);
  const [priority, setPriority] = useState(task.priority);
  const [selectedTags, setSelectedTags] = useState(task.tags);
  const [taskType, setTaskType] = useState(task.type);
  const [projectStage, setProjectStage] = useState(task.projectStage);
  const [status, setStatus] = useState(task.status);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assignee);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="hidden" />
        <DialogDescription>
          <div className="px-3">
            <div className="flex">
              <div className="text-start">
                <div className="flex space-x-3">
                  <PriorityDropdown
                    priority={priority}
                    setPriority={setPriority}
                    taskId={task.id}
                  />
                  <TaskTypePicker
                    taskId={task.id}
                    currentType={taskType}
                    setTaskType={setTaskType}
                  />
                </div>
                <div className="mt-1">
                  <TitleEditable
                    title={title}
                    taskId={task.id}
                    setTitle={setTitle}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <StoryPointsField
                    storyPoints={storyPoints}
                    taskId={task.id}
                    setStoryPoints={setStoryPoints}
                  />
                  <TaskStatusDropdown
                    status={status}
                    setStatus={setStatus}
                    taskId={task.id}
                  />
                </div>
                <AssigneeDropdown
                  assignee={assignee}
                  setAssignee={setAssignee}
                  taskId={task.id}
                />
                <DescriptionEditable
                  description={description}
                  taskId={task.id}
                  setDescription={setDescription}
                />
              </div>
              <div className="mt-14 ml-6">
                {/* Conditionally render TimeLogs or HistoryLogs */}
                {isKanbanBoard ? (
                  <TimeLogs
                    taskId={task.id}
                    timeLogs={task.timeLogs}
                    members={members}
                    assignee={assignee || members[0]}
                  />
                ) : (
                  <HistoryLogs
                    historyLogs={task.historyLogs}
                    members={members}
                  />
                )}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <ProjectStagesDropdown
                  projectStage={projectStage}
                  setProjectStage={setProjectStage}
                  taskId={task.id}
                />
                <div className="flex items-center space-x-2 justify-end">
                  <TagDropdown
                    selectedTags={selectedTags}
                    onTagChange={setSelectedTags}
                    taskId={task.id}
                  />
                  <DeleteButton
                    taskId={task.id}
                    closeDialog={onClose || (() => {})}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
