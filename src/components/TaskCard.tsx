import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BotIcon, EllipsisIcon } from "lucide-react";
import { TaskCardExpanded } from "./TaskCardExpanded";
import { Task } from "@/models/Task";
import { getPriorityColor } from "@/models/Priority";
import { TagBadge } from "@/components/TagBadge";

export const TaskCard = ({
  index,
  title,
  storyPoints,
  priority,
  avatarUrl,
  tag,
  assignee,
  description,
  projectStage,
  status,
  type,
}: Task) => {
  const { bgColor: priorityBgColor, textColor: priorityTextColor } =
    getPriorityColor(priority);

  return (
    <Dialog>
      <DialogTrigger className="w-96">
        {/* Card component */}
        <Card className="relative rounded-xl">
          <CardContent className="text-start mt-6">
            <div className="w-full flex justify-between">
              <p
                className={`${priorityBgColor} ${priorityTextColor} py-1 px-3 rounded-md w-fit text-sm font-bold`}
              >
                {priority}
              </p>
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
            <TagBadge tag={tag} />
          </CardFooter>
        </Card>
      </DialogTrigger>
      {/* Dialog content */}
      <DialogContent className="bg-white max-w-3xl">
        <DialogDescription>
          <TaskCardExpanded
            index={index}
            title={title}
            storyPoints={storyPoints}
            priority={priority}
            avatarUrl={avatarUrl}
            tag={tag}
            assignee={assignee}
            description={description}
            projectStage={projectStage}
            status={status}
            type={type}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
