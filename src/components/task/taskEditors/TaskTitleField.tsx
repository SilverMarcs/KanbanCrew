import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { truncateText } from "@/lib/utils";

interface TaskTitleFieldProps {
  title: string;
  setTitle: (title: string) => void;
  taskId?: string;
  disabled?: boolean;
}

export function TaskTitleField({
  title,
  setTitle,
  taskId,
  disabled = false,
}: TaskTitleFieldProps) {
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
    <div style={{ width: "350px", height: "40px" }}>
      {isEditing && !disabled ? (
        <Input
          ref={inputRef}
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-3xl font-bold p-0 border-0"
          style={{ boxShadow: "none" }}
        />
      ) : (
        <h2
          className={`text-3xl font-bold truncate ${
            disabled ? "" : "cursor-pointer"
          }`}
          onClick={() => !disabled && setIsEditing(true)} // Prevent entering edit mode if disabled
          style={{ width: "350px", height: "35px", whiteSpace: "nowrap" }}
        >
          {truncateText(title, 26)}
        </h2>
      )}
    </div>
  );
}
