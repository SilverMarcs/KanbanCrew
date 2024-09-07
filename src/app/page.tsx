"use client";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Task } from "@/models/Task";
import { Member } from "@/models/Member";
import { CreateTaskCard } from "@/components/CreateTaskCard";
import { TaskCard } from "@/components/TaskCard";
import { TagFilter } from "@/components/TagFilter";
import { Tag } from "@/models/Tag";
import { SortButton, SortField, SortOrder } from "@/components/SortButton";
import { Priority, PriorityOrder } from "@/models/Priority";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // Real-time sync for tasks
  useEffect(() => {
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
            historyLogs: data.historyLogs,
          });
        }

        setTasks(tasksData); // Set tasks with real-time data
        setFilteredTasks(tasksData); // Apply filtering if needed
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Real-time sync for members
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "members"), (snapshot) => {
      const membersData: Member[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[];
      setMembers(membersData);
    });

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
          <TaskCard key={index} {...task} members={members} />
        ))}
        <CreateTaskCard />
      </div>
    </div>
  );
}
