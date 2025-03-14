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
  onSortChange: (sortFields: { field: SortField; order: SortOrder }[]) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({ onSortChange }) => {
  const [sortByCreationDate, setSortByCreationDate] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);

  useEffect(() => {
    if (sortOrder !== null) {
      handleSortChange();
    }
  }, [sortByCreationDate, sortByPriority, sortOrder]);

  const handleSortChange = () => {
    const sortFields: { field: SortField; order: SortOrder }[] = [];
    if (sortByCreationDate) {
      sortFields.push({ field: SortField.CreationDate, order: sortOrder! });
    }
    if (sortByPriority) {
      sortFields.push({ field: SortField.Priority, order: sortOrder! });
    }
    onSortChange(sortFields);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowDownUpIcon className="mr-1" size={20} />
          <span> Sort By</span>
          <ChevronDown className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={sortByCreationDate}
          onCheckedChange={(checked) => {
            setSortByCreationDate(checked);
            setSortByPriority(false);
          }}
        >
          Date
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={sortByPriority}
          onCheckedChange={(checked) => {
            setSortByPriority(checked);
            setSortByCreationDate(false); // Ensure only one is selected
          }}
        >
          Priority
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator className="bg-secondary" />
        <DropdownMenuCheckboxItem
          checked={sortOrder === SortOrder.Ascending}
          onCheckedChange={() => setSortOrder(SortOrder.Ascending)}
        >
          Ascending
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={sortOrder === SortOrder.Descending}
          onCheckedChange={() => setSortOrder(SortOrder.Descending)}
        >
          Descending
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export enum SortField {
  CreationDate = "creationDate",
  Priority = "priority",
}

export enum SortOrder {
  Ascending = "ascending",
  Descending = "descending",
}
