import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EllipsisIcon } from "lucide-react";
import { TaskCardExpanded } from "./TaskCardExpanded";
import { getTagColor, getPriorityColor } from "@/lib/utils";

export interface TaskCardProps {
  index: number;
  title: string;
  storyPoints: number;
  priority: string;
  avatarUrl: string;
  tag:
    | "Frontend"
    | "Backend"
    | "API"
    | "Database"
    | "Testing"
    | "UI/UX"
    | "Framework";
}

export const TaskCard = ({
  index,
  title,
  storyPoints,
  priority,
  avatarUrl,
  tag,
}: TaskCardProps) => {
  const { bgColor: tagBgColor, textColor: tagTextColor } = getTagColor(tag);
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
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </CardContent>
          <CardFooter className="flex w-full justify-end">
            <div
              className={`${tagBgColor} ${tagTextColor} py-2 px-4 rounded-3xl text-xs font-bold absolute bottom-3 right-3`}
            >
              {tag}
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      {/* Dialog content */}
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <TaskCardExpanded
            {...{ index, title, storyPoints, priority, avatarUrl, tag }}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
