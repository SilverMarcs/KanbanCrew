import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/TagBadge";
import { Tag } from "@/models/Tag";
import { Filter, ChevronDown, CalendarCog } from "lucide-react"; // Updated to include CalendarCog
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
        <div className="flex justify-end space-x-2 mr-4 mt-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {/* Custom Button with Filter and ChevronDown */}
                    <button className="flex items-center border border-[#FDC90F] text-[#FDC90F] px-4 py-2 rounded-md bg-transparent hover:bg-[#D8B22F] hover:text-black transition-colors text-base">
                        <Filter className="mr-1" />
                        <span className="font-medium">Tag Filter</span>
                        <ChevronDown className="ml-1" />
                    </button>
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

            {/* Sort By Button with CalendarCog */}
            <button className="flex items-center border border-[#FDC90F] text-[#FDC90F] px-4 py-2 rounded-md bg-transparent hover:bg-[#D8B22F] hover:text-black transition-colors text-base">
                <CalendarCog className="mr-1" />
                <span className="font-medium">Sort By</span>
                <ChevronDown className="ml-1" />
            </button>
        </div>
    );
};