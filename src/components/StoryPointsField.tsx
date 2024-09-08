import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface StoryPointsFieldProps {
  storyPoints: number;
  setStoryPoints: (points: number) => void;
  taskId?: string;
}

export const StoryPointsField: React.FC<StoryPointsFieldProps> = ({
  storyPoints,
  setStoryPoints,
  taskId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localPoints, setLocalPoints] = useState(storyPoints);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 10) {
      setLocalPoints(value);
    }
  };

  const handleBlur = async () => {
    setIsEditing(false);
    setStoryPoints(localPoints);
    if (taskId) {
      await updateStoryPoints(taskId, localPoints);
    }
  };

  const updateStoryPoints = async (taskId: string, newPoints: number) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await updateDoc(taskRef, {
        storyPoints: newPoints,
      });
    } catch (error) {
      console.error("Error updating story points:", error);
    }
  };

  return (
    <div className="w-10 h-5 flex items-center">
      {isEditing ? (
        <Input
          type="number"
          value={localPoints}
          onChange={handleChange}
          onBlur={handleBlur}
          min={1}
          max={10}
          className="w-full h-full text-center p-0 text-sm text-black"
          style={{ height: "29px", minHeight: "24px" }}
          autoFocus
        />
      ) : (
        <div
          onClick={handleClick}
          className="w-full h-full flex items-center justify-center cursor-pointer text-gray-500 font-bold text-sm"
        >
          {storyPoints} SP
        </div>
      )}
    </div>
  );
};
