import React, { useState } from "react";
import { motion } from "framer-motion";
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
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  members,
  topTrailingChild,
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.95 }}
          className="task-card-container"
        >
          <Card className="relative rounded-xl task-card">
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
                {topTrailingChild}
              </div>
              <div className="text-xl font-bold mt-2">
                {truncateText(title)}
              </div>
              <div className="text-gray-500">Story point - {storyPoints}</div>
              <div className="flex justify-between items-end">
                <Avatar className="mt-6">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {assignee.firstName[0]}
                    {assignee.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex space-x-1">
                  {tags.map((tag) => (
                    <TagDot key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
            timeLogs={timeLogs}
            historyLogs={historyLogs}
            members={members}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
