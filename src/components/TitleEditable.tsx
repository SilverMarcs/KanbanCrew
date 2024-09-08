import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface TitleEditableProps {
  title: string;
  setTitle: (title: string) => void;
  taskId?: string;
}

export function TitleEditable({ title, setTitle, taskId }: TitleEditableProps) {
  const [isEditing, setIsEditing] = useState(!taskId);
  const [localTitle, setLocalTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(localTitle.length, localTitle.length);
    }
  }, [isEditing, localTitle]);

  const handleUpdate = async (newTitle: string) => {
    if (newTitle !== title) {
      setTitle(newTitle);
      setLocalTitle(newTitle);
      if (taskId) {
        try {
          const taskRef = doc(db, "tasks", taskId);
          await updateDoc(taskRef, { title: newTitle });
        } catch (error) {
          console.error("Error updating title:", error);
        }
      }
    }
    if (taskId) {
      setIsEditing(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleUpdate(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdate(e.currentTarget.value);
    }
  };

  return (
    <div className="inline-block my-2">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-3xl text-black font-bold p-0 h-auto border-none"
        />
      ) : (
        <h2
          className="text-3xl text-black font-bold cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h2>
      )}
    </div>
  );
}
