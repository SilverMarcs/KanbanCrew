import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface DescriptionEditableProps {
  description: string;
  setDescription: (description: string) => void;
  taskId?: string;
}

export function DescriptionEditable({
  description,
  setDescription,
  taskId,
}: DescriptionEditableProps) {
  const [isEditing, setIsEditing] = useState(!taskId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  // const [descriptionHeight, setDescriptionHeight] = useState<number>(70);
  // const [descriptionWidth, setDescriptionWidth] = useState<number>(375);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        description.length,
        description.length
      );
    }
  }, [isEditing, description]);

  // useEffect(() => {
  //   if (descriptionRef.current) {
  //     setDescriptionHeight(descriptionRef.current.offsetHeight);
  //     setDescriptionWidth(descriptionRef.current.offsetWidth);
  //   }
  // }, [description]);

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
    <div
      className="inline-block mt-4"
      style={{ width: "350px", height: "120px" }}
    >
      <p className="font-bold text-xl">Description</p>
      {isEditing ? (
        <Textarea
          ref={textareaRef}
          className="mt-2 border-2 p-1"
          value={description}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          style={{
            boxShadow: "none",
          }}
        />
      ) : (
        <p
          ref={descriptionRef}
          className="text-gray-600 mt-2 cursor-pointer text-sm"
          onClick={() => setIsEditing(true)}
        >
          {description || "No description available. Click to add one."}
        </p>
      )}
      {/* </div> */}
    </div>
  );
}
