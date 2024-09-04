import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CirclePlus } from "lucide-react";
import { TagBadge } from "./TagBadge";
import { Tag } from "@/models/Tag";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface TagDropdownProps {
  selectedTags: Tag[];
  onTagChange: (tags: Tag[]) => void;
  taskId: string;
}

export const TagDropdown: React.FC<TagDropdownProps> = ({
  selectedTags,
  onTagChange,
  taskId,
}) => {
  const tags = Object.values(Tag);

  const handleTagToggle = async (tag: Tag) => {
    let newSelectedTags: Tag[];
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }

    onTagChange(newSelectedTags);
    await updateTaskTags(taskId, newSelectedTags);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="h-6 w-6 bg-transparent hover:bg-gray-100 border-gray-300 hover:border-gray-400 transition-colors"
        >
          <CirclePlus className="h-4 w-4 text-black" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Tags</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag}
            checked={selectedTags.includes(tag)}
            onCheckedChange={() => handleTagToggle(tag)}
          >
            <TagBadge tag={tag} />
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const updateTaskTags = async (taskId: string, newTags: Tag[]) => {
  const taskRef = doc(db, "tasks", taskId);

  try {
    await updateDoc(taskRef, {
      tags: newTags,
    });
  } catch (error) {
    console.error("Error updating tags:", error);
  }
};
