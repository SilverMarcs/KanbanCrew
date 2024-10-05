"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useFilteredAndSortedTasks } from "@/hooks/useFilteredAndSortedTasks";
import { CreateTaskCard } from "@/components/task/CreateTaskCard";
import { TaskCard } from "@/components/task/TaskCard";
import { TagFilter } from "@/components/task/TagFilter";
import { Tag } from "@/models/Tag";
import { SortButton, SortField, SortOrder } from "@/components/task/SortButton";
import { Task } from "@/models/Task";
import { EllipsisIcon } from "lucide-react";

export default function ProductBacklog() {
  const tasks = useTasks();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [sortFields, setSortFields] = useState<
    { field: SortField; order: SortOrder }[]
  >([]);

  const filteredAndSortedTasks = useFilteredAndSortedTasks(
    tasks,
    selectedTags,
    sortFields
  );

  const handleSortChange = (
    newSortFields: { field: SortField; order: SortOrder }[]
  ) => {
    setSortFields(newSortFields);
  };

  return (
    <div className="min-h-screen p-16">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold">Product Backlog</h1>
        <div className="flex space-x-4">
          <TagFilter
            selectedTags={selectedTags}
            onTagChange={setSelectedTags}
          />
          <SortButton onSortChange={handleSortChange} />
        </div>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {filteredAndSortedTasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            topTrailingChild={<EllipsisIcon />}
          />
        ))}
        <CreateTaskCard />
      </div>
    </div>
  );
}
