import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/TagBadge";
import { Tag } from "@/models/Tag";
import { Filter, ChevronDown } from "lucide-react";

interface TagFilterProps {
    selectedTags: Tag[];
    onTagChange: (tags: Tag[]) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ selectedTags, onTagChange }) => {
    const tags = Object.values(Tag);

    const handleTagToggle = (tag: Tag) => {
        if (selectedTags.includes(tag)) {
            onTagChange(selectedTags.filter((t) => t !== tag));
        } else {
            onTagChange([...selectedTags, tag]);
        }
    };

    const handleResetFilters = () => {
        onTagChange([]);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center border-[#FDC90F] text-[#FDC90F] px-4 py-2 rounded-md bg-transparent hover:bg-[#D8B22F] hover:text-black transition-colors text-base"
                >
                    <Filter className="mr-1" />
                    <span className="font-medium">Tag Filter</span>
                    <ChevronDown className="ml-1" />
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
                <DropdownMenuSeparator />
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={handleResetFilters} className="text-red-500">
                        Reset Filters
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};