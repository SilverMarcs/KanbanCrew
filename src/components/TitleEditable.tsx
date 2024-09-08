import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export function TitleEditable({
  title: initialTitle,
  taskId,
}: {
  title: string;
  taskId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(title.length, title.length);
    }
  }, [isEditing, title]);

  const handleUpdate = async (newTitle: string) => {
    if (newTitle !== title) {
      try {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { title: newTitle });
        setTitle(newTitle);
      } catch (error) {
        console.error("Error updating title:", error);
      }
    }
    setIsEditing(false);
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
          defaultValue={title}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-3xl text-black font-bold p-0 h-auto border-none" // focus-visible:ring-1 focus-visible:ring-offset-0 to make the outline thinner
        />
      ) : (
        <h2
          ref={titleRef}
          className="text-3xl text-black font-bold cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h2>
      )}
    </div>
  );
}
