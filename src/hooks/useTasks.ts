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
import { Type } from "@/models/Type";
import { Status } from "@/models/Status";
import { ProjectStage } from "@/models/ProjectStage";
import { Tag } from "@/models/Tag";
import { Sprint } from "@/models//sprints/Sprint";

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
          let sprint: DocumentReference<Sprint> | null = null;

          if (data.assignee instanceof DocumentReference) {
            const assigneeDoc = await getDoc(data.assignee);
            if (assigneeDoc.exists()) {
              assignee = assigneeDoc.data() as Member;
            }
          }

          if (data.sprint instanceof DocumentReference) {
            sprint = data.sprint;
          }

          tasksData.push({
            id: docSnapshot.id,
            index: data.index,
            title: data.title,
            storyPoints: data.storyPoints,
            priority: data.priority,
            avatarUrl: data.avatarUrl,
            tags: data.tags as Tag[],
            assignee:
              assignee ||
              ({
                id: "",
                firstName: "Unknown",
                lastName: "Assignee",
              } as Member),
            description: data.description,
            projectStage: data.projectStage as ProjectStage,
            status: data.status as Status,
            type: data.type as Type,
            creationDate: data.creationDate,
            historyLogs: data.historyLogs,
            sprint: sprint, // Include sprint reference
          });
        }

        setTasks(tasksData);
      }
    );

    return () => unsubscribe();
  }, []);

  return tasks;
};
