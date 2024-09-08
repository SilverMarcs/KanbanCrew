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
import { TagDropdown } from "@/components/TagDropdown";
import { PriorityDropdown } from "@/components/PriorityDropdown";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  doc,
} from "firebase/firestore";
import { Priority } from "@/models/Priority";
import { Tag } from "@/models/Tag";
import { ProjectStage } from "@/models/ProjectStage";
import { Status } from "@/models/Status";
import { Type } from "@/models/Type";
import { TagBadge } from "@/components/TagBadge";
import { TaskTypePicker } from "./TaskTypePicker";
import { DescriptionEditable } from "./DescriptionEditable";
import { ProjectStagesDropdown } from "./ProjectStagesDropdown";
import { TitleEditable } from "./TitleEditable";
import { StoryPointsField } from "./StoryPointsField";
import { AssigneeDropdown } from "./AssigneeDropdown";
import { Member } from "@/models/Member";
import { TaskStatusDropdown } from "./TaskStatusDropdown";

export const CreateTaskCard = () => {
  const defaultTitle = "New Task";
  const defaultStoryPoints = 3;
  const defaultPriority = Priority.Low;
  const defaultAvatarUrl = "";
  const defaultTags: Tag[] = [];
  const defaultDescription = "Task description...";
  const defaultProjectStage = ProjectStage.Planning;
  const defaultStatus = Status.NotStarted;
  const defaultType = Type.UserStory;

  const [title, setTitle] = useState(defaultTitle);
  const [storyPoints, setStoryPoints] = useState(defaultStoryPoints);
  const [priority, setPriority] = useState<Priority>(defaultPriority);
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatarUrl);
  const [tags, setTags] = useState<Tag[]>([]);
  const [description, setDescription] = useState(defaultDescription);
  const [projectStage, setProjectStage] =
    useState<ProjectStage>(defaultProjectStage);
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [type, setType] = useState<Type>(defaultType);

  const [assignee, setAssignee] = useState<Member | null>(null);

  // Fetch the first member from the members collection
  useEffect(() => {
    const fetchFirstMember = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);

      if (!membersSnapshot.empty) {
        const firstMemberDoc = membersSnapshot.docs[0];
        const memberData = firstMemberDoc.data();

        // Create a Member object
        const member: Member = {
          id: firstMemberDoc.id,
          firstName: memberData.firstName || "No",
          lastName: memberData.lastName || "Members",
        };

        setAssignee(member);
        setAvatarUrl(memberData.avatarUrl || "");
      }
    };

    fetchFirstMember();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleCreateTask = async () => {
    if (!assignee) {
      // TODO: assigne to current user automatically first
      console.error("No assignee selected");
      return;
    }

    if (tags.length === 0) {
      console.error("No tags selected");
      return;
    }

    const newTask = {
      title,
      storyPoints,
      priority,
      avatarUrl,
      tags,
      assignee: doc(db, "members", assignee.id),
      description,
      projectStage,
      status,
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
    setAvatarUrl(defaultAvatarUrl);
    setTags(defaultTags);
    setDescription(defaultDescription);
    setProjectStage(defaultProjectStage);
    setStatus(defaultStatus);
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
      <DialogTrigger className="w-96 h-full" onClick={() => setIsOpen(true)}>
        <Card className="rounded-xl border-dashed border-2 border-gray-300 bg-transparent h-full">
          <CardContent className="flex justify-center h-full items-center p-0">
            <PlusCircleIcon size={50} className="text-gray-300" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-3xl">
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
                <PriorityDropdown
                  priority={priority}
                  setPriority={setPriority}
                />
                <TaskTypePicker currentType={type} setTaskType={setType} />
              </div>
              <div className="mt-1">
                <TitleEditable title={title} setTitle={setTitle} />
              </div>
              <div className="flex items-center space-x-1">
                <StoryPointsField
                  storyPoints={storyPoints}
                  setStoryPoints={setStoryPoints}
                />
                <TaskStatusDropdown status={status} setStatus={setStatus} />
              </div>
              <AssigneeDropdown assignee={assignee} setAssignee={setAssignee} />
              <div className="-mb-10">
                {" "}
                {/* This shoudltn be necessary */}
                <DescriptionEditable
                  description={description}
                  setDescription={setDescription}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="mt-20 flex justify-between items-center">
              <ProjectStagesDropdown
                projectStage={projectStage}
                setProjectStage={setProjectStage}
              />
              <div className="flex items-center space-x-2">
                {tags.map((tag, i) => (
                  <TagBadge key={i} tag={tag} />
                ))}
                <TagDropdown selectedTags={tags} onTagChange={setTags} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
