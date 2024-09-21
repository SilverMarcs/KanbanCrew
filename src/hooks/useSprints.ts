import { useEffect, useState } from "react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Sprint } from "@/models/sprints/Sprint";
import { Status } from "@/models/Status";

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
          taskIds: data.taskIds || [],
        });
      }

      setSprints(sprintsData);
    });

    return () => unsubscribe();
  }, []);

  return sprints;
};
