import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/TagBadge";
import { Tag } from "@/models/Tag";
import clsx from "clsx";

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
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary">
                        Filter Tags
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
        </div>
    );
};