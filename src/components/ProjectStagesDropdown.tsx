import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { ProjectStage } from "@/models/ProjectStage";

export function ProjectStagesDropdown({
  projectStage,
  setProjectStage,
  taskId,
}: {
  projectStage: ProjectStage;
  setProjectStage: (stage: ProjectStage) => void;
  taskId?: string;
}) {
  const handleStageChange = async (value: string) => {
    const newStage = value as ProjectStage;
    setProjectStage(newStage);

    if (taskId) {
      await updateProjectStage(taskId, newStage);
    }
  };

  const updateProjectStage = async (taskId: string, stage: ProjectStage) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { projectStage: stage });
  };

  return (
    <div className="flex space-x-3 items-center">
      <p className="font-semibold text-gray-600">Project stage</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center bg-transparent font-bold hover:bg-transparent text-black">
            {projectStage} <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Project Stage</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={projectStage}
            onValueChange={handleStageChange}
          >
            {Object.values(ProjectStage).map((stage) => (
              <DropdownMenuRadioItem key={stage} value={stage}>
                {stage}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
