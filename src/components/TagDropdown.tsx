"use client";
import { FC, useState } from "react";
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
import { toast } from "react-toastify";

interface TagDropdownProps {
  selectedTags: Tag[];
  onTagChange: (tags: Tag[]) => void;
  taskId?: string;
}

export const TagDropdown: FC<TagDropdownProps> = ({
  selectedTags,
  onTagChange,
  taskId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const tags = Object.values(Tag);

  const handleTagToggle = async (tag: Tag) => {
    let newSelectedTags: Tag[];
    if (selectedTags.includes(tag)) {
      if (selectedTags.length === 1) {
        toast.error("At least one tag must be selected");
        return;
      }
      newSelectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }

    onTagChange(newSelectedTags);

    if (taskId) {
      await updateTaskTags(taskId, newSelectedTags);
    }
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-transparent hover:bg-gray-100 border-gray-300 hover:border-gray-400 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          {selectedTags.length === 0 ? (
            <>
              <span className="text-sm text-gray-500 mr-2">Select a tag</span>
              <CirclePlus className="h-4 w-4 text-black" />
            </>
          ) : (
            <CirclePlus className="h-4 w-4 text-black" />
          )}
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
            disabled={selectedTags.includes(tag) && selectedTags.length === 1}
            onSelect={(event) => event.preventDefault()}
          >
            <TagBadge tag={tag} />
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
