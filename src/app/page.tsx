"use client";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  getDoc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Task } from "@/models/Task";
import { CreateTaskCard } from "@/components/CreateTaskCard";
import { TaskCard } from "@/components/TaskCard";
import { TagFilter } from "@/components/TagFilter";
import { Tag } from "@/models/Tag";
import { SortButton, SortField, SortOrder } from "@/components/SortButton";
import { Priority, PriorityOrder } from "@/models/Priority";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  useEffect(() => {
    // Real-time sync with Firestore
    const unsubscribe = onSnapshot(
      collection(db, "tasks"),
      async (snapshot) => {
        const tasksData: Task[] = [];

        for (const docSnapshot of snapshot.docs) {
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
          } else {
            console.error(
              "Expected a DocumentReference for assignee, but got:",
              data.assignee
            );
          }

          tasksData.push({
            id: docSnapshot.id,
            index: data.index,
            title: data.title,
            storyPoints: data.storyPoints,
            priority: data.priority as Priority,
            avatarUrl: data.avatarUrl,
            tags: data.tags,
            assignee: assigneeName,
            description: data.description,
            projectStage: data.projectStage,
            status: data.status,
            type: data.type,
            creationDate: data.creationDate,
          });
        }

        setTasks(tasksData); // Set tasks with real-time data
        setFilteredTasks(tasksData); // Apply filtering if needed
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Filter tasks by selected tags
  useEffect(() => {
    if (selectedTags.length > 0) {
      setFilteredTasks(
        tasks.filter((task) =>
          task.tags.some((tag) => selectedTags.includes(tag))
        )
      );
    } else {
      setFilteredTasks(tasks);
    }
  }, [selectedTags, tasks]);

  const handleSortChange = (
    sortFields: { field: SortField; order: SortOrder }[]
  ) => {
    let sortedTasks = [...tasks];

    sortFields.forEach(({ field, order }) => {
      if (field === SortField.Priority) {
        sortedTasks = sortedTasks.sort((a, b) => {
          const aPriority = PriorityOrder[a.priority];
          const bPriority = PriorityOrder[b.priority];
          return order === SortOrder.Ascending
            ? bPriority - aPriority
            : aPriority - bPriority;
        });
      } else if (field === SortField.CreationDate) {
        sortedTasks = sortedTasks.sort((a, b) => {
          const aDate = a.creationDate.toDate();
          const bDate = b.creationDate.toDate();
          return order === SortOrder.Ascending
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
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
          <TagFilter
            selectedTags={selectedTags}
            onTagChange={setSelectedTags}
          />
          <SortButton onSortChange={handleSortChange} />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {filteredTasks.map((task, index) => (
          <TaskCard
            id={task.id}
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
            creationDate={task.creationDate}
          />
        ))}
        <CreateTaskCard />
      </div>
    </div>
  );
}
