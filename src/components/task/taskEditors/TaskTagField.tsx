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
import { TagBadge } from "../TagBadge";
import { Tag } from "@/models/Tag";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "react-toastify";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TaskTagFieldProps {
  selectedTags: Tag[];
  onTagChange: (tags: Tag[]) => void;
  taskId?: string;
}

export const TaskTagField: FC<TaskTagFieldProps> = ({
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
    <div className="flex items-center space-x-2">
      <ScrollArea className={"w-96 whitespace-nowrap rounded-md"}>
        <div className="flex w-full space-x-2 p-4 justify-end">
          {selectedTags.map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            // className="bg-transparent hover:bg-gray-100 border-gray-300 hover:border-gray-400 transition-colors"
            variant="secondary"
            onClick={() => setIsOpen(true)}
          >
            {selectedTags.length === 0 ? (
              <>
                <span className="text-sm text-secondary-foreground text- mr-2">
                  Select a tag
                </span>
                <CirclePlus size={20} />
              </>
            ) : (
              <CirclePlus size={20} />
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
    </div>
  );
};
