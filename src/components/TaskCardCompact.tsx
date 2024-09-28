import React, { useState } from "react";
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

interface TaskCardCompactProps {
  task: Task;
  members: Member[];
  topTrailingChild?: React.ReactNode;
  isKanbanBoard?: boolean;
}

export const TaskCardCompact: React.FC<TaskCardCompactProps> = ({
  task,
  members,
  topTrailingChild,
  isKanbanBoard = false,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(task.priority);

  const TypeIcon = task.type === Type.UserStory ? Scroll : Bug;
  const typeIconColor =
    task.type === Type.UserStory ? "text-blue-500" : "text-orange-500";

  return (
    <>
      <Card
        className="relative rounded-xl cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="text-start py-3 px-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
              <p
                className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-xs font-bold`}
              >
                {task.priority}
              </p>
              <TypeIcon className={`${typeIconColor}`} size={16} />
              <Avatar className="w-8 h-8">
                <AvatarImage src={task.avatarUrl} />
                <AvatarFallback>
                  {task.assignee.firstName[0]}
                  {task.assignee.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            {topTrailingChild}
          </div>
          <div className="text-xl font-bold">{truncateText(task.title)}</div>
          <div className="flex justify-between">
            <div className="text-gray-500 text-xs">
              Story point - {task.storyPoints}
            </div>
            <div className="flex space-x-1">
              {task.tags.map((tag) => (
                <TagDot key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <TaskCardExpanded
        task={task}
        members={members}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isKanbanBoard={isKanbanBoard}
      />
    </>
  );
};
