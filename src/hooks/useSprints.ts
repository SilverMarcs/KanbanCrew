import { useEffect, useState } from "react";
import { collection, onSnapshot, Timestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Sprint } from "@/models/sprints/Sprint";
import { SprintStatus } from "@/models/sprints/SprintStatus";

export const useSprints = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sprints"), (snapshot) => {
      const sprintsData: Sprint[] = [];
      const currentDate = new Date();

      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        const startDate = data.startDate.toDate();
        const endDate = data.endDate.toDate();
        let status = data.sprintStatus as SprintStatus;

        // Determine if the sprint is active or done
        if (currentDate >= startDate && currentDate <= endDate) {
          status = SprintStatus.Active;
        } else if (currentDate > endDate) {
          status = SprintStatus.Done;
        }

        
        sprintsData.push({
          id: docSnapshot.id,
          name: data.name,
          status: status,
          startDate: data.startDate as Timestamp,
          endDate: data.endDate as Timestamp,
          taskIds: data.taskIds || [],
        });

        // Update Firestore 
        if (status !== data.sprintStatus) {
          const sprintRef = doc(db, "sprints", docSnapshot.id);
          updateDoc(sprintRef, { sprintStatus: status }).catch((error) => {
            console.error("Error updating sprint status: ", error);
          });
        }
      }

      setSprints(sprintsData);
    });

    return () => unsubscribe();
  }, []);

  return sprints;
}; 