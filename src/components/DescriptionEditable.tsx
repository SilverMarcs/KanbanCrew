import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export function DescriptionEditable({
  description: initialDescription,
  taskId,
}: {
  description: string;
  taskId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [tempDescription, setTempDescription] = useState(initialDescription);
  const [isLoading, setIsLoading] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState<number | null>(70); // Set a smaller default height
  const [descriptionWidth, setDescriptionWidth] = useState<number | null>(375); // Set a fixed width
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for Textarea

  // Focus the Textarea when editing mode is activated
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus(); // Auto-focus the Textarea
      textareaRef.current.setSelectionRange(
        tempDescription.length,
        tempDescription.length
      ); // Move cursor to the end
    }
  }, [isEditing, tempDescription]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { description: tempDescription });
      setDescription(tempDescription);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating description:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempDescription(description);
    setIsEditing(false);
  };

  return (
    <div className="mt-6">
      <p className="font-bold text-xl">Description</p>
      {isEditing ? (
        <div
          style={{
            height: `${descriptionHeight}px`, // Apply the fixed height
            width: `${descriptionWidth}px`, // Apply the fixed width
          }}
        >
          <Textarea
            ref={textareaRef} // Attach the ref to the Textarea
            className="mt-2"
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            disabled={isLoading}
            style={{
              height: `${descriptionHeight}px`, // Ensure Textarea has the same height
              width: `${descriptionWidth}px`, // Ensure Textarea has the same fixed width
            }}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p
          ref={descriptionRef}
          className="text-gray-600 mt-2 cursor-pointer"
          onClick={() => setIsEditing(true)}
          style={{
            height: `${descriptionHeight}px`, // Ensure static text has the same height
            width: `${descriptionWidth}px`, // Ensure static text has the same fixed width
          }}
        >
          {description || "No description available. Click to add one."}
        </p>
      )}
    </div>
  );
}
