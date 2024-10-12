import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface TaskDescriptionFieldProps {
  description: string;
  setDescription: (description: string) => void;
  taskId?: string;
}

export function TaskDescriptionField({
  description,
  setDescription,
  taskId,
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
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            className="mt-2 border-2 p-1"
            value={description}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            style={{
              boxShadow: "none",
              height: "80px", // Match the height of the non-editing <p>
            }}
          />
        ) : (
          <p
            ref={descriptionRef}
            className="text-muted-foreground mt-2 cursor-pointer text-sm overflow-hidden"
            onClick={() => setIsEditing(true)}
            style={{
              height: "80px", // Ensure this matches the Textarea height
              maxHeight: "80px",
              whiteSpace: "pre-wrap", // Keep line breaks
              overflowY: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Add ellipsis when content overflows
            }}
          >
            {description || "No description available. Click to add one."}
          </p>
        )}
      </div>
    </div>
  );
}