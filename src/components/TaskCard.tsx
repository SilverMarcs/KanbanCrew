import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BotIcon, EllipsisIcon } from "lucide-react";
import { TaskCardExpanded } from "./TaskCardExpanded";
import { Task } from "@/models/Task";
import { Member } from "@/models/Member"; // Import Member type
import { getPriorityColor } from "@/models/Priority";
import { TagBadge } from "@/components/TagBadge";
import { useState } from "react";

interface TaskCardProps extends Task {
  members: Member[]; // Add members prop to TaskCard
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
  const [currentAssignee, setCurrentAssignee] = useState(assignee);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAssigneeChange = (newAssignee: string) => {
    setCurrentAssignee(newAssignee);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <div className="absolute bottom-3 right-3">
              {tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      {/* Dialog content */}
      <DialogContent className="bg-white max-w-3xl">
        <DialogTitle className="hidden" />{" "}
        {/* Hidden DialogTitle to avoid warnings */}
        <DialogDescription>
          <TaskCardExpanded
            id={id}
            index={index}
            title={title}
            storyPoints={storyPoints}
            priority={priority}
            avatarUrl={avatarUrl}
            tags={tags}
            assignee={currentAssignee}
            description={description}
            projectStage={projectStage}
            status={status}
            type={type}
            creationDate={creationDate}
            closeDialog={closeDialog}
            historyLogs={historyLogs}
            members={members} // Pass members to TaskCardExpanded
            onAssigneeChange={handleAssigneeChange}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
