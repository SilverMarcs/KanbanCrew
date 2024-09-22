"use client";

import React, { useState, useEffect } from "react";
import { useSprints } from "@/hooks/useSprints";
import { CreateSprintCard } from "./CreateSprintCard";
import SprintCard from "./SprintCard";
import { Sprint } from "@/models/sprints/Sprint";
import { SprintStatus } from "@/models/sprints/SprintStatus";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import ConfirmationDialog from "@/components/ConfirmationDialog";

const SprintList: React.FC = () => {
  const sprints = useSprints(); // Fetches all sprints
  const [sortedSprints, setSortedSprints] = useState<Sprint[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null);

  useEffect(() => {
    // Sorting logic: Active sprints on top, then by start date
    const sorted = [...sprints].sort((a, b) => {
      if (a.status === SprintStatus.Active) return -1;
      if (b.status === SprintStatus.Active) return 1;
      return a.startDate.toMillis() - b.startDate.toMillis();
    });
    setSortedSprints(sorted);
  }, [sprints]);

  const handleSetActive = (sprint: Sprint) => {
    const currentlyActive = sortedSprints.find(s => s.status === SprintStatus.Active);
    if (currentlyActive) {
      setActiveSprint(sprint);
      setIsConfirmOpen(true);
    } else {
      updateSprintStatus(sprint);
    }
  };

  const updateSprintStatus = async (sprint: Sprint) => {
    const updatedSprints = sortedSprints.map(s => {
      if (s.id === sprint.id) {
        return { ...s, status: SprintStatus.Active };
      } else if (s.status === SprintStatus.Active) {
        return { ...s, status: SprintStatus.Done };
      }
      return s;
    });

    // Set sorted sprints based on the new status
    const sorted = updatedSprints.sort((a, b) => {
      if (a.status === SprintStatus.Active) return -1;
      if (b.status === SprintStatus.Active) return 1;
      return a.startDate.toMillis() - b.startDate.toMillis();
    });

    setSortedSprints(sorted);

    // Update Firestore
    for (const updatedSprint of updatedSprints) {
      const sprintRef = doc(db, "sprints", updatedSprint.id);
      await updateDoc(sprintRef, { status: updatedSprint.status });
    }
  };

  const confirmActivation = () => {
    if (activeSprint) {
      updateSprintStatus(activeSprint);
      setActiveSprint(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 my-4">
      {sortedSprints.map((sprint) => (
        <div key={sprint.id}>
          <SprintCard
            sprint={sprint}
            sortedSprints={sortedSprints}
            setSortedSprints={setSortedSprints}
          />
        </div>
      ))}
      <CreateSprintCard />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmActivation}
        title="Confirm Activation"
        description="Activating this sprint will force-end a currently active sprint. Proceed?"
        confirmButtonLabel="Proceed"
        cancelButtonLabel="Cancel"
      />
    </div>
  );
};

export default SprintList;
