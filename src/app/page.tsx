"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, DocumentReference } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Task } from "@/models/Task";
import { CreateTaskCard } from "@/components/CreateTaskCard";
import { TaskCard } from "@/components/TaskCard";
import { TagFilter } from "@/components/TagFilter";
import { Tag } from "@/models/Tag";
import { SortButton } from "@/components/SortButton";
import { Priority } from "@/models/Priority"; // Import your Priority enum

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksData: Task[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();

        let assigneeName = "Unknown Assignee";
        if (data.assignee instanceof DocumentReference) {
          const assigneeDoc = await getDoc(data.assignee);
          if (assigneeDoc.exists()) {
            const assigneeData = assigneeDoc.data() as {
              firstName: string;
              lastName: string;
            };
            assigneeName = `${assigneeData.firstName} ${assigneeData.lastName}`;
          }
        }

        tasksData.push({
          index: data.index,
          title: data.title,
          storyPoints: data.storyPoints,
          priority: data.priority as Priority, // Cast to Priority enum
          avatarUrl: data.avatarUrl,
          tags: data.tags,
          assignee: assigneeName,
          description: data.description,
          projectStage: data.projectStage,
          status: data.status,
          type: data.type,
        });
      }

      setTasks(tasksData);
      setFilteredTasks(tasksData);
    };

    fetchTasks();
  }, []);

  // Define a numeric mapping for priority levels
  const priorityOrder = {
    [Priority.Urgent]: 1,
    [Priority.Important]: 2,
    [Priority.Low]: 3,
  };

  const handleSortChange = (sortFields: { field: "date" | "priority"; order: "ascending" | "descending" }[]) => {
    let sortedTasks = [...tasks];

    sortFields.forEach(({ field, order }) => {
      if (field === "date") {
        sortedTasks = sortedTasks.sort((a, b) =>
          order === "ascending" ? a.index - b.index : b.index - a.index
        );
      } else if (field === "priority") {
        sortedTasks = sortedTasks.sort((a, b) => {
          const aPriority = priorityOrder[a.priority]; // Convert priority to numeric value
          const bPriority = priorityOrder[b.priority]; // Convert priority to numeric value
          // For ascending order, sort by bPriority - aPriority (Urgent > Important > Low)
          // For descending order, sort by aPriority - bPriority (Low > Important > Urgent)
          return order === "ascending" ? bPriority - aPriority : aPriority - bPriority;
        });
      }
    });

    setFilteredTasks(sortedTasks);
  };

  return (
    <div className="p-16">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold">Product Backlog</h1>
        <div className="flex space-x-4">
          <TagFilter selectedTags={selectedTags} onTagChange={setSelectedTags} />
          <SortButton onSortChange={handleSortChange} />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {filteredTasks.map((task, index) => (
          <TaskCard
            key={index}
            index={task.index}
            title={task.title}
            storyPoints={task.storyPoints}
            priority={task.priority}
            avatarUrl={task.avatarUrl}
            tags={task.tags}
            assignee={task.assignee}
            description={task.description}
            projectStage={task.projectStage}
            status={task.status}
            type={task.type}
          />
        ))}
        <CreateTaskCard />
      </div>
    </div>
  );
}
