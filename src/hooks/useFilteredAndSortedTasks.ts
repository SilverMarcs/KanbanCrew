// hooks/useFilteredAndSortedTasks.ts

import { useMemo } from "react";
import { Task } from "@/models/Task";
import { Tag } from "@/models/Tag";
import { SortField, SortOrder } from "@/components/SortButton";
import { Priority, PriorityOrder } from "@/models/Priority";

export const useFilteredAndSortedTasks = (
  tasks: Task[],
  selectedTags: Tag[],
  sortFields: { field: SortField; order: SortOrder }[]
) => {
  return useMemo(() => {
    // First, filter the tasks
    let filteredTasks = tasks;
    if (selectedTags.length > 0) {
      filteredTasks = tasks.filter((task) =>
        task.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Then, sort the filtered tasks
    let sortedTasks = [...filteredTasks];

    sortFields.forEach(({ field, order }) => {
      sortedTasks.sort((a, b) => {
        let comparison = 0;

        switch (field) {
          case SortField.Priority:
            comparison = PriorityOrder[a.priority] - PriorityOrder[b.priority];
            break;
          case SortField.CreationDate:
            comparison =
              a.creationDate.toDate().getTime() -
              b.creationDate.toDate().getTime();
            break;
        }

        return order === SortOrder.Ascending ? comparison : -comparison;
      });
    });

    return sortedTasks;
  }, [tasks, selectedTags, sortFields]);
};
