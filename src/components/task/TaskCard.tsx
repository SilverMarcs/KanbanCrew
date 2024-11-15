import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Scroll, Bug } from "lucide-react";
import { TaskCardExpanded } from "./TaskCardExpanded";
import { Task } from "@/models/Task";
import { getPriorityColor } from "@/models/Priority";
import { TagDot } from "./TagDot";
import { truncateText } from "@/lib/utils";
import { Type } from "@/models/Type";
import { UserAvatar } from "../UserAvatar";

interface TaskCardProps {
  task: Task;
  topTrailingChild?: React.ReactNode;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  topTrailingChild,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(task.priority);

  const TypeIcon = task.type === Type.UserStory ? Scroll : Bug;
  const typeIconColor =
    task.type === Type.UserStory ? "text-blue-500" : "text-orange-500";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.95 }}
        className="task-card-container w-96" // Added fixed width here
        onClick={() => setIsDialogOpen(true)}
      >
        <Card className="relative rounded-xl task-card h-full">
          <CardContent className="text-start mt-6">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <p
                  className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-sm font-bold`}
                >
                  {task.priority}
                </p>
                <TypeIcon className={`${typeIconColor}`} size={16} />
              </div>
              {topTrailingChild}
            </div>
            <div className="text-xl font-bold mt-2">
              {truncateText(task.title)}
            </div>
            <div className="text-muted-foreground">
              Story point - {task.storyPoints}
            </div>
            <div className="flex justify-between items-end">
              <div className="mt-6">
                <UserAvatar member={task.assignee} />
              </div>

              <div className="flex space-x-1">
                {task.tags.map((tag) => (
                  <TagDot key={tag} tag={tag} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <TaskCardExpanded
        task={task}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};
