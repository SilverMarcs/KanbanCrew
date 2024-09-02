"use client"
import { useEffect, useState } from "react";
import { collection, getDocs, getDoc, DocumentReference } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Task } from '@/models/Task';
import { CreateTaskCard } from "@/components/CreateTaskCard";
import { TaskCard } from "@/components/TaskCard";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks")); // "tasks" is name of the collection
      const tasksData: Task[] = [];

      // Loop through each document in the collection (each document represents a task)
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();

        let assigneeName = "Unknown Assignee";

        // Check if assignee is a DocumentReference
        if (data.assignee instanceof DocumentReference) {
          const assigneeDoc = await getDoc(data.assignee);
          if (assigneeDoc.exists()) {
            // Get the assignee's first and last name
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
          index: data.index,
          title: data.title,
          storyPoints: data.storyPoints,
          priority: data.priority,
          avatarUrl: data.avatarUrl,
          tag: data.tag,
          assignee: assigneeName,
          description: data.description,
          projectStage: data.projectStage,
          status: data.status,
          type: data.type,
        });
      }

      setTasks(tasksData);
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-16">
      <h1 className="text-5xl font-bold">Product Backlog</h1>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            index={task.index}
            title={task.title}
            storyPoints={task.storyPoints}
            priority={task.priority}
            avatarUrl={task.avatarUrl}
            tag={task.tag}
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
