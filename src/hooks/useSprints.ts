import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Sprint } from "@/models/sprints/Sprint";
import { Status } from "@/models/Status";
import { Task } from "@/models/Task";

export const useSprints = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sprints"), (snapshot) => {
      const sprintsData: Sprint[] = [];

      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();

        sprintsData.push({
          id: docSnapshot.id,
          name: data.name,
          status: data.sprintStatus as Status,
          startDate: data.startDate as Timestamp,
          endDate: data.endDate as Timestamp,
          tasks: data.tasks as DocumentReference<Task>[], // Include tasks references
        });
      }

      setSprints(sprintsData);
    });

    return () => unsubscribe();
  }, []);

  return sprints;
};
