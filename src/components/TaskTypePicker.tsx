import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Type } from "@/models/Type";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Scroll } from "lucide-react";

type TaskTypePickerProps = {
  taskId?: string;
  currentType: Type;
  setTaskType: React.Dispatch<React.SetStateAction<Type>>;
};

export const TaskTypePicker = ({
  taskId,
  currentType,
  setTaskType,
}: TaskTypePickerProps) => {
  const handleTypeChange = async (newType: Type) => {
    setTaskType(newType);

    if (taskId) {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { type: newType });
        console.log(`Task ${taskId} updated to type: ${newType}`);
      } catch (error) {
        console.error("Error updating task type:", error);
      }
    }
  };

  return (
    <Tabs
      value={currentType}
      onValueChange={(value) => handleTypeChange(value as Type)}
    >
      <TabsList className="grid w-full grid-cols-2 h-8">
        <TabsTrigger
          value={Type.UserStory}
          className="flex items-center justify-center gap-2 h-full py-0"
          title="User Story"
        >
          <Scroll
            size={16}
            className={currentType === Type.UserStory ? "text-blue-500" : ""}
          />
        </TabsTrigger>
        <TabsTrigger
          value={Type.Bug}
          className="flex items-center justify-center gap-2 h-full py-0"
          title="Bug"
        >
          <Bug
            size={16}
            className={currentType === Type.Bug ? "text-orange-500" : ""}
          />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
