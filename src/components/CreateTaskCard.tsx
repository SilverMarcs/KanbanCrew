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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TagDropdown } from "@/components/TagDropdown";
import { PriorityDropdown } from "@/components/PriorityDropdown";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  DocumentReference,
  doc,
  Timestamp,
} from "firebase/firestore";
import { Priority } from "@/models/Priority";
import { Tag } from "@/models/Tag";
import { ProjectStage } from "@/models/ProjectStage";
import { Status } from "@/models/Status";
import { Type } from "@/models/Type";
import { TagBadge } from "@/components/TagBadge";
import { TaskTypePicker } from "./TaskTypePicker";

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

  const [title, setTitle] = useState("New Task");
  const [storyPoints, setStoryPoints] = useState(3);
  const [priority, setPriority] = useState<Priority>(Priority.Low);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [assignee, setAssignee] = useState<DocumentReference | null>(null);
  const [description, setDescription] = useState("Task description...");
  const [projectStage, setProjectStage] = useState<ProjectStage>(
    ProjectStage.Planning
  );
  const [status, setStatus] = useState<Status>(Status.NotStarted);
  const [type, setType] = useState<Type>(Type.UserStory);

  // Fetch the first member from the members collection
  useEffect(() => {
    const fetchFirstMember = async () => {
      const membersCollection = collection(db, "members");
      const membersSnapshot = await getDocs(membersCollection);

      if (!membersSnapshot.empty) {
        const firstMemberDoc = membersSnapshot.docs[0];
        setAssignee(doc(db, "members", firstMemberDoc.id));
        setAvatarUrl(firstMemberDoc.data().avatarUrl || "");
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
      console.error("No tags selected"); // Ensure that at least one tag is selected
      return;
    }

    const newTask = {
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
        if (!open) {
          resetStates();
        }
      }}
    >
      <DialogTrigger className="w-96 h-full" onClick={() => setIsOpen(true)}>
        <Card className="rounded-xl border-dashed border-2 border-gray-300 bg-transparent h-full">
          <CardContent className="flex justify-center h-full items-center p-0">
            <PlusCircleIcon size={50} className="text-gray-300" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
          <Button
            className="ml-auto"
            onClick={handleCreateTask}
            disabled={tags.length === 0}
          >
            Create Task
          </Button>
        </DialogHeader>
        <div className="text-start px-3">
          <div className="w-full flex items-center space-x-2">
            <PriorityDropdown priority={priority} setPriority={setPriority} />
            <TaskTypePicker currentType={type} setTaskType={setType} />
          </div>
          <div className="flex space-x-2 align-middle items-center mt-2">
            <Input
              className="text-3xl text-black font-bold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p> - {type}</p>
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              className="text-gray-500 font-bold"
              value={storyPoints}
              onChange={(e) => setStoryPoints(Number(e.target.value))}
            />
            <p className="font-bold">- {status}</p>
          </div>
          <p className="text-muted-foreground font-semibold mt-6">Assignee</p>
          <div className="mt-2 flex space-x-2 w-full items-center">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Input value={assignee ? assignee.id : ""} readOnly />
          </div>
          <div className="mt-6">
            <p className="font-bold text-xl">Description</p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-20 flex justify-between items-center">
            <div className="flex space-x-3 items-center">
              <p className="font-semibold text-gray-600">Project stage</p>
              <Input value={projectStage} readOnly />
            </div>
            <div className="flex items-center space-x-2">
              {tags.map((tag, i) => (
                <TagBadge key={i} tag={tag} />
              ))}
              <TagDropdown selectedTags={tags} onTagChange={setTags} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
