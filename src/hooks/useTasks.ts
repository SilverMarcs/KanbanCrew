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

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tasks"),
      async (snapshot) => {
        const tasksData: Task[] = [];

        for (const docSnapshot of snapshot.docs) {
          const data = docSnapshot.data();

          let assignee: Member | null = null;

          if (data.assignee instanceof DocumentReference) {
            const assigneeDoc = await getDoc(data.assignee);
            if (assigneeDoc.exists()) {
              assignee = assigneeDoc.data() as Member;
              assignee.id = assigneeDoc.id;
            }
          }

          tasksData.push({
            id: docSnapshot.id,
            index: data.index,
            title: data.title,
            storyPoints: data.storyPoints,
            priority: data.priority,
            tags: data.tags,
            assignee:
              assignee ||
              ({
                id: "",
                firstName: "Unknown",
                lastName: "Assignee",
              } as Member),
            description: data.description,
            projectStage: data.projectStage,
            status: data.status,
            type: data.type,
            creationDate: data.creationDate,
            completedDate: data.completedDate,
            historyLogs: data.historyLogs,
            timeLogs: data.timeLogs,
            sprintId: data.sprintId || null, // Use sprintId instead of sprint reference
          });
        }

        setTasks(tasksData);
      }
    );

    return () => unsubscribe();
  }, []);

  return tasks;
};
