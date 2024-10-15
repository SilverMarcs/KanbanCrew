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

export function TaskProjectStageField({
  projectStage,
  setProjectStage,
  taskId,
  disabled = false,
}: {
  projectStage: ProjectStage;
  setProjectStage: (stage: ProjectStage) => void;
  taskId?: string;
  disabled?: boolean;
}) {
  const handleStageChange = async (value: string) => {
    if (disabled) return; // Block changes if disabled
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
      <p className="font-semibold text-secondary-foreground text-sm min-w-fit">
        Project stage
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`bg-transparent font-bold flex items-center ${
              disabled ? "" : "hover:bg-transparent"
            }`}
            disabled={disabled} // Disable button when disabled is true
          >
            {projectStage}{" "}
            {!disabled && <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        {!disabled && (
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
        )}
      </DropdownMenu>
    </div>
  );
}
