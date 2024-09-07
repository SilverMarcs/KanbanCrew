import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BotIcon, EllipsisIcon, Scroll, Bug } from "lucide-react";
import { TaskCardExpanded } from "./TaskCardExpanded";
import { Task } from "@/models/Task";
import { Member } from "@/models/Member";
import { getPriorityColor } from "@/models/Priority";
import { TagBadge } from "@/components/TagBadge";
import { useState } from "react";
import { Type } from "@/models/Type"; // Make sure to import the Type enum

interface TaskCardProps extends Task {
  members: Member[];
}

export const TaskCard = ({
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
  members,
}: TaskCardProps) => {
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
          <CardContent className="text-start mt-6">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <p
                  className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-sm font-bold`}
                >
                  {priority}
                </p>
                <TypeIcon className={`${typeIconColor}`} size={16} />
              </div>
              <EllipsisIcon />
            </div>
            <div className="text-xl font-bold mt-2">{title}</div>
            <div className="text-gray-500">Story point - {storyPoints}</div>
            <Avatar className="mt-6">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                <BotIcon />
              </AvatarFallback>
            </Avatar>
          </CardContent>
          <CardFooter className="flex w-full justify-end">
            <div className="absolute bottom-3 right-3">
              {tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </CardFooter>
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
            members={members}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
