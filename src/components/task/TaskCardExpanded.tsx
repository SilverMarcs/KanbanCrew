import React from "react";
import { Task } from "@/models/Task";
import { TaskTagField } from "./taskEditors/TaskTagField";
import { useState } from "react";
import { TaskPriorityField } from "./taskEditors/TaskPriorityField";
import HistoryLogs from "@/components/task/HistoryLogs";
import DeleteButton from "@/components/task/DeleteButton";
import { TaskDescriptionField } from "@/components/task/taskEditors/TaskDescriptionField";
import { TaskTitleField } from "@/components/task/taskEditors/TaskTitleField";
import { StoryPointsField } from "@/components/task/taskEditors/StoryPointsField";
import { TaskTypeField } from "@/components/task/taskEditors/TaskTypeField";
import { TaskProjectStageField } from "@/components/task/taskEditors/ProjectStagesDropdown";
import { AssigneeField } from "@/components/task/taskEditors/AssigneeField";
import TimeLogs from "@/components/task/TimeLogs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMembers } from "@/hooks/useMembers";
import { TaskStatusBadge } from "@/components/task/TaskStatusBadge";
import { useAuthContext } from "@/contexts/AuthContext";
import { HistoryLog } from "@/models/HistoryLog";
import { Timestamp, updateDoc } from "@firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { doc } from "firebase/firestore";

interface TaskCardExpandedProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  isKanbanBoard?: boolean;
  isEditable?: boolean;
}

export const TaskCardExpanded: React.FC<TaskCardExpandedProps> = ({
  task,
  isOpen,
  onClose,
  isKanbanBoard = false,
  isEditable = true,
}) => {
  const members = useMembers();
  const { member: currentMember } = useAuthContext();

  const [title, setTitle] = useState(task.title);
  const [storyPoints, setStoryPoints] = useState(task.storyPoints);
  const [priority, setPriority] = useState(task.priority);
  const [selectedTags, setSelectedTags] = useState(task.tags);
  const [taskType, setTaskType] = useState(task.type);
  const [projectStage, setProjectStage] = useState(task.projectStage);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assignee);

  const logHistory = () => {
    if (!currentMember) {
      throw new Error("Current member is not available");
    }

    const historyLog: HistoryLog = {
      member: doc(db, "members", currentMember.id),
      time: Timestamp.now(),
    };

    try {
      updateDoc(doc(db, "tasks", task.id), {
        historyLogs: [...task.historyLogs, historyLog],
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogTitle className="hidden" />
        <DialogDescription>
          <div className="px-3">
            <div className="flex">
              <div className="text-start">
                <div className="flex space-x-3">
                  <TaskPriorityField
                    taskId={task.id}
                    priority={priority}
                    setPriority={(newPriority) => {
                      setPriority(newPriority);
                      logHistory();
                    }}
                    disabled={!isEditable}
                  />
                  <TaskTypeField
                    taskId={task.id}
                    currentType={taskType}
                    setTaskType={(newType) => {
                      setTaskType(newType);
                      logHistory();
                    }}
                    disabled={!isEditable}
                  />
                </div>
                <div className="mt-1">
                  <TaskTitleField
                    title={title}
                    taskId={task.id}
                    setTitle={(newTitle) => {
                      setTitle(newTitle);
                      logHistory();
                    }}
                    disabled={!isEditable}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <StoryPointsField
                    storyPoints={storyPoints}
                    taskId={task.id}
                    setStoryPoints={(newStoryPoints) => {
                      setStoryPoints(newStoryPoints);
                      logHistory();
                    }}
                    disabled={!isEditable}
                  />
                  <TaskStatusBadge status={task.status} />
                </div>
                <AssigneeField
                  assignee={assignee}
                  taskId={task.id}
                  setAssignee={(newAssignee) => {
                    setAssignee(newAssignee);
                    logHistory();
                  }}
                  disabled={!isEditable}
                />
                <TaskDescriptionField
                  description={description}
                  taskId={task.id}
                  setDescription={(newDescription) => {
                    setDescription(newDescription);
                    logHistory();
                  }}
                  disabled={!isEditable}
                />
              </div>
              <div className="mt-14 ml-6">
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
                <TaskProjectStageField
                  projectStage={projectStage}
                  taskId={task.id}
                  setProjectStage={(newStage) => {
                    setProjectStage(newStage);
                    logHistory();
                  }}
                  disabled={!isEditable}
                />
                <div className="flex items-center space-x-2 justify-end">
                  <TaskTagField
                    selectedTags={selectedTags}
                    onTagChange={(newTags) => {
                      setSelectedTags(newTags);
                      logHistory();
                    }}
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
