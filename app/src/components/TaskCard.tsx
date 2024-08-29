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

// Function to map tags to their respective colors
const getTagColor = (tag: TaskCardProps["tag"]) => {
  switch (tag) {
    case "Frontend":
      return { bgColor: "bg-blue-300", textColor: "text-blue-600" };
    case "Backend":
      return { bgColor: "bg-green-300", textColor: "text-green-600" };
    case "API":
      return { bgColor: "bg-yellow-300", textColor: "text-yellow-600" };
    case "Database":
      return { bgColor: "bg-red-300", textColor: "text-red-600" };
    case "Testing":
      return { bgColor: "bg-purple-300", textColor: "text-purple-600" };
    case "UI/UX":
      return { bgColor: "bg-pink-300", textColor: "text-pink-600" };
    case "Framework":
      return { bgColor: "bg-indigo-300", textColor: "text-indigo-600" };
    default:
      return { bgColor: "bg-gray-300", textColor: "text-gray-600" };
  }
};

// Function to map priorities to their respective colors
const getPriorityColor = (priority: TaskCardProps["priority"]) => {
  switch (priority) {
    case "Important":
      return { bgColor: "bg-orange-400", textColor: "text-orange-800" };
    case "Urgent":
      return { bgColor: "bg-red-400", textColor: "text-red-800" };
    case "Low":
      return { bgColor: "bg-green-300", textColor: "text-green-600" };
    default:
      return { bgColor: "bg-gray-300", textColor: "text-gray-600" };
  }
};

export const TaskCard = ({
  index,
  title,
  storyPoints,
  priority,
  avatarUrl,
  tag,
}: TaskCardProps) => {
  const { bgColor, textColor } = getTagColor(tag);
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
              className={`${bgColor} ${textColor} py-2 px-4 rounded-3xl text-xs font-bold absolute bottom-3 right-3`}
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
          This is the detailed description of card {title}.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
