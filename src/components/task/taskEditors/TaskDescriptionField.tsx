import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface TaskDescriptionFieldProps {
  description: string;
  setDescription: (description: string) => void;
  taskId?: string;
  disabled?: boolean;
}

export function TaskDescriptionField({
  description,
  setDescription,
  taskId,
  disabled = false,
}: TaskDescriptionFieldProps) {
  const [isEditing, setIsEditing] = useState(!taskId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        description.length,
        description.length
      );
    }
  }, [isEditing, description]);

  const handleChange = async (newDescription: string) => {
    setDescription(newDescription);

    if (taskId) {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { description: newDescription });
      } catch (error) {
        console.error("Error updating description:", error);
      }
    }
  };

  return (
    <div className="inline-block mt-4">
      <p className="font-bold text-xl">Description</p>
      <div style={{ width: "350px", height: "100px" }}>
        {isEditing && !disabled ? (
          <Textarea
            ref={textareaRef}
            className="mt-2 border-2 p-1"
            value={description}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            disabled={disabled} // Disable textarea if disabled is true
            style={{
              boxShadow: "none",
              height: "80px",
            }}
          />
        ) : (
          <p
            ref={descriptionRef}
            className={`text-muted-foreground mt-2 text-sm overflow-hidden ${
              disabled ? "" : "cursor-pointer"
            }`}
            onClick={() => !disabled && setIsEditing(true)} // Prevent entering edit mode if disabled
            style={{
              height: "80px",
              maxHeight: "80px",
              whiteSpace: "pre-wrap",
              overflowY: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description || "No description available. Click to add one."}
          </p>
        )}
      </div>
    </div>
  );
}
