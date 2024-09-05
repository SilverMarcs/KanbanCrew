import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowDownUpIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface SortButtonProps {
    onSortChange: (sortFields: { field: "date" | "priority"; order: "ascending" | "descending" }[]) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({ onSortChange }) => {
    const [sortByDate, setSortByDate] = useState(false);
    const [sortByPriority, setSortByPriority] = useState(false);
    const [sortOrder, setSortOrder] = useState<"ascending" | "descending" | null>(null);

    useEffect(() => {
        if (sortOrder !== null) { 
            handleSortChange();
        }
    }, [sortByDate, sortByPriority, sortOrder]);

    const handleSortChange = () => {
        const sortFields: { field: "date" | "priority"; order: "ascending" | "descending" }[] = [];
        if (sortByDate) {
            sortFields.push({ field: "date", order: sortOrder! });
        }
        if (sortByPriority) {
            sortFields.push({ field: "priority", order: sortOrder! });
        }
        onSortChange(sortFields);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center border-[#FDC90F] text-[#FDC90F] px-4 py-2 rounded-md bg-transparent hover:bg-[#D8B22F] hover:text-black transition-colors text-base"
                >
                    <ArrowDownUpIcon className="mr-1" />
                    <span className="font-medium">Sort By</span>
                    <ChevronDown className="ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuCheckboxItem
                    checked={sortByDate}
                    onCheckedChange={(checked) => {
                        setSortByDate(checked);
                        setSortByPriority(false); 
                    }}
                >
                    Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={sortByPriority}
                    onCheckedChange={(checked) => {
                        setSortByPriority(checked);
                        setSortByDate(false); // Ensure only one is selected
                    }}
                >
                    Priority
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator className="bg-gray-300" />
                <DropdownMenuCheckboxItem
                    checked={sortOrder === "ascending"}
                    onCheckedChange={() => setSortOrder("ascending")} 
                >
                    Ascending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={sortOrder === "descending"}
                    onCheckedChange={() => setSortOrder("descending")} 
                >
                    Descending
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
