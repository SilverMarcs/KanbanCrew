import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { TagBadge } from "./TagBadge";
import { Tag } from "@/models/Tag";

interface TagDropdownProps {
  selectedTags: Tag[];
  onTagChange: (tags: Tag[]) => void;
}

export const DropdownTag: React.FC<TagDropdownProps> = ({ selectedTags, onTagChange }) => {
  const tags = Object.values(Tag);

  const handleTagToggle = (tag: Tag) => {
      if (selectedTags.includes(tag)) {
          onTagChange(selectedTags.filter((t) => t !== tag));
      } else {
          onTagChange([...selectedTags, tag]);
      }
  };

    const handleTagChange = (tag: Tag) => {
    onTagChange([tag]);
  };

  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button
                  size="icon"
                  className="h-6 w-6 mt-1 bg-transparent hover:bg-gray-100 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  <ChevronDown className="h-4 w-4 text-black" />
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
                      <TagBadge tag={tag}/>
                  </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
      </DropdownMenu>
  );
};
