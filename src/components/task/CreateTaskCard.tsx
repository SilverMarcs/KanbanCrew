import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { TaskTagField } from "@/components/task/taskEditors/TaskTagField";
import { TaskPriorityField } from "@/components/task/taskEditors/TaskPriorityField";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, Timestamp, doc } from "firebase/firestore";
import { Priority } from "@/models/Priority";
import { Tag } from "@/models/Tag";
import { ProjectStage } from "@/models/ProjectStage";
import { Status } from "@/models/Status";
import { Type } from "@/models/Type";
import { TaskTypeField } from "./taskEditors/TaskTypeField";
import { TaskDescriptionField } from "./taskEditors/TaskDescriptionField";
import { TaskProjectStageField } from "./taskEditors/ProjectStagesDropdown";
import { TaskTitleField } from "./taskEditors/TaskTitleField";
import { StoryPointsField } from "./taskEditors/StoryPointsField";
import { AssigneeField } from "./taskEditors/AssigneeField";
import { Member } from "@/models/Member";
import { useAuthContext } from "@/contexts/AuthContext";

export const CreateTaskCard = () => {
  const defaultTitle = "New Task";
  const defaultStoryPoints = 3;
  const defaultPriority = Priority.Low;
  const defaultTags: Tag[] = [];
  const defaultDescription = "Task description...";
  const defaultProjectStage = ProjectStage.Planning;
  const defaultStatus = Status.NotStarted;
  const defaultType = Type.UserStory;

  const [title, setTitle] = useState(defaultTitle);
  const [storyPoints, setStoryPoints] = useState(defaultStoryPoints);
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [tags, setTags] = useState<Tag[]>([]);
  const [description, setDescription] = useState(defaultDescription);
  const [projectStage, setProjectStage] =
    useState<ProjectStage>(defaultProjectStage);
  const [type, setType] = useState<Type>(defaultType);
  const [assignee, setAssignee] = useState<Member | null>(null);

  const { member: loggedInMember } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setAssignee(loggedInMember);
  }, [loggedInMember]);

  const handleCreateTask = async () => {
    if (tags.length === 0) {
      console.error("No tags selected");
      return;
    }

    const newTask = {
      title,
      storyPoints,
      priority,
      tags,
      assignee: doc(db, "members", assignee!.id), // TODO: shouldnt need such complexity
      description,
      projectStage,
      status: defaultStatus,
      type,
      creationDate: Timestamp.now(),
    };

    // Add the new task to Firebase
    await addDoc(collection(db, "tasks"), newTask);

    // Reset all states to default values
    resetStates();

    // Close the dialog
    setIsOpen(false);
  };

  const resetStates = () => {
    setTitle(defaultTitle);
    setStoryPoints(defaultStoryPoints);
    setPriority(defaultPriority);
    setTags(defaultTags);
    setDescription(defaultDescription);
    setProjectStage(defaultProjectStage);
    setType(defaultType);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetStates();
      }}
    >
      <DialogTrigger className="w-96 h-48" onClick={() => setIsOpen(true)}>
        <Card className="rounded-xl border-dashed border-2 border-gray-300 bg-transparent h-full">
          <CardContent className="flex justify-center h-full items-center p-0">
            <PlusCircleIcon size={50} className="text-gray-400" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-7">
            <span>Create a new task</span>
            <Button onClick={handleCreateTask} disabled={tags.length === 0}>
              Create Task
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="px-3">
          <div className="flex">
            <div className="text-start">
              <div className="flex space-x-3">
                <TaskPriorityField
                  priority={priority}
                  setPriority={setPriority}
                />
                <TaskTypeField currentType={type} setTaskType={setType} />
              </div>
              <div className="mt-1">
                <TaskTitleField title={title} setTitle={setTitle} />
              </div>
              <div className="flex items-center space-x-1">
                <StoryPointsField
                  storyPoints={storyPoints}
                  setStoryPoints={setStoryPoints}
                />
              </div>
              <AssigneeField assignee={assignee!} setAssignee={setAssignee} />
              <div className="-mb-10">
                {/* This negative bottom padding shouldn not be necessary */}
                <TaskDescriptionField
                  description={description}
                  setDescription={setDescription}
                />
              </div>
            </div>
          </div>
          <div>
            {/* dunno why margin top needed here but not expanded card */}
            <div>
              <div className="mt-14 flex justify-between items-center">
                <TaskProjectStageField
                  projectStage={projectStage}
                  setProjectStage={setProjectStage}
                />
                <TaskTagField selectedTags={tags} onTagChange={setTags} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
