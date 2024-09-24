import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Scroll, Bug } from "lucide-react";
import { TaskCardExpanded } from "./TaskCardExpanded";
import { Task } from "@/models/Task";
import { Member } from "@/models/Member";
import { getPriorityColor } from "@/models/Priority";
import { TagDot } from "./TagDot";
import { truncateText } from "@/lib/utils";
import { Type } from "@/models/Type";

interface TaskCardProps {
  task: Task;
  members: Member[];
  topTrailingChild?: React.ReactNode;
  isKanbanBoard?: boolean; // Add this prop to determine if the parent is KanbanBoard
}

export const TaskCardCompact: React.FC<TaskCardProps> = ({
  task,
  members,
  topTrailingChild,
  isKanbanBoard = false, // Default to false if not provided
}) => {
  const {
    id,
    index,
    title,
    storyPoints,
    priority,
    avatarUrl,
    tags,
    assignee,
    description,
    projectStage,
    status,
    type,
    creationDate,
    historyLogs,
    timeLogs,
  } = task;

  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(priority);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const TypeIcon = type === Type.UserStory ? Scroll : Bug;
  const typeIconColor =
    type === Type.UserStory ? "text-blue-500" : "text-orange-500";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="w-96">
        <Card className="relative rounded-xl">
          <CardContent className="text-start py-3 px-4">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <p
                  className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-xs font-bold`}
                >
                  {priority}
                </p>
                <TypeIcon className={`${typeIconColor}`} size={16} />
                <Avatar className="w-8 h-8">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {assignee.firstName[0]}
                    {assignee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              {topTrailingChild}
            </div>
            <div className="text-xl font-bold">{truncateText(title)}</div>
            <div className="flex justify-between">
              <div className="text-gray-500 text-xs">
                Story point - {storyPoints}
              </div>
              <div className="flex space-x-1">
                {tags.map((tag) => (
                  <TagDot key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-3xl">
        <DialogTitle className="hidden" />
        <DialogDescription>
          <TaskCardExpanded
            id={id}
            index={index}
            title={title}
            storyPoints={storyPoints}
            priority={priority}
            avatarUrl={avatarUrl}
            tags={tags}
            assignee={assignee}
            description={description}
            projectStage={projectStage}
            status={status}
            type={type}
            creationDate={creationDate}
            closeDialog={closeDialog}
            historyLogs={historyLogs}
            timeLogs={timeLogs}
            members={members}
            isKanbanBoard={isKanbanBoard}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
