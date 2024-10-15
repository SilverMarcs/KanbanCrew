import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Type } from "@/models/Type";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Scroll } from "lucide-react";

type TaskTypeFieldProps = {
  taskId?: string;
  currentType: Type;
  setTaskType: (type: Type) => void;
  disabled?: boolean;
};

export const TaskTypeField = ({
  taskId,
  currentType,
  setTaskType,
  disabled = false,
}: TaskTypeFieldProps) => {
  const handleTypeChange = async (newType: Type) => {
    if (disabled) return; // Block changes if disabled

    console.log("Changing task type to:", newType);
    setTaskType(newType);

    if (taskId) {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { type: newType });
      } catch (error) {
        console.error("Error updating task type:", error);
      }
    }
  };

  return (
    <Tabs
      value={currentType}
      onValueChange={(value) => {
        if (!disabled) handleTypeChange(value as Type);
      }} // Prevent changing if disabled
      className={`w-44 ${disabled ? "pointer-events-none" : ""}`} // Disable interaction and add visual cue when disabled
    >
      <TabsList className="flex h-8 p-1 w-fit justify-center">
        {!(disabled && currentType !== Type.UserStory) && (
          <TabsTrigger
            value={Type.UserStory}
            className={`
                    flex items-center justify-center gap-2 h-full py-0 px-2
                    transition-all duration-300 ease-in-out rounded-sm
                `}
            title="User Story"
          >
            <Scroll
              size={16}
              className={`transition-colors duration-300 ml-2 ${
                currentType === Type.UserStory
                  ? "text-blue-500"
                  : "text-muted-foreground"
              }`}
            />
            <span
              className={`
                        transition-all duration-300 whitespace-nowrap text-blue-600 mr-2
                        ${
                          currentType === Type.UserStory
                            ? "w-16 opacity-100"
                            : "w-0 opacity-0"
                        }
                    `}
            >
              User Story
            </span>
          </TabsTrigger>
        )}
        {!(disabled && currentType !== Type.Bug) && (
          <TabsTrigger
            value={Type.Bug}
            className={`
              flex items-center justify-center gap-2 h-full py-0 px-2
              transition-all duration-300 ease-in-out rounded-sm
            `}
            title="Bug"
          >
            <Bug
              size={16}
              className={`transition-colors duration-300 ml-2 ${
                currentType === Type.Bug
                  ? "text-orange-500"
                  : "text-muted-foreground"
              }`}
            />
            <span
              className={`
            transition-all duration-300 whitespace-nowrap text-orange-600 mr-1
            ${currentType === Type.Bug ? "w-8 opacity-100" : "w-0 opacity-0"}
              `}
            >
              Bug
            </span>
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
};
