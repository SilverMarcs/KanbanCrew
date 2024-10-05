import React, { useState, useEffect } from "react";
import { TitleEditable } from "@/components/task/TitleEditable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { SprintStatus } from "@/models/sprints/SprintStatus";
import { Sprint } from "@/models/sprints/Sprint";
import {
  doc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/hooks/use-toast";
import { SprintStatusBadge } from "./SprintStatusBadge";

interface SprintDetailsProps {
  sprint: Sprint;
  onClose: () => void;
}

export const SprintDetails: React.FC<SprintDetailsProps> = ({
  sprint,
  onClose,
}) => {
  const [title, setTitle] = useState(sprint.name);
  const [status, setStatus] = useState<SprintStatus>(sprint.status);
  const [from, setFrom] = useState<Date>(sprint.startDate.toDate());
  const [to, setTo] = useState<Date>(sprint.endDate.toDate());

  useEffect(() => {
    setTitle(sprint.name);
    setStatus(sprint.status);
    setFrom(sprint.startDate.toDate());
    setTo(sprint.endDate.toDate());
  }, [sprint]);

  const handleUpdate = async () => {
    if (status === SprintStatus.Done) return;

    try {
      const sprintRef = doc(db, "sprints", sprint.id);
      const updateData: any = {
        endDate: Timestamp.fromDate(to),
      };

      if (status === SprintStatus.NotStarted) {
        updateData.name = title;
        updateData.startDate = Timestamp.fromDate(from);
      }

      await updateDoc(sprintRef, updateData);

      toast({
        title: `${title} updated`,
        description: (
          <div>
            <p>Status: {status}</p>
            <p>From: {format(from, "P")}</p>
            <p>To: {format(to, "P")}</p>
          </div>
        ),
      });
      onClose();
    } catch (error) {
      console.error("Error updating sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to update the sprint.",
      });
    }
  };

  const handleForceStart = async () => {
    if (status !== SprintStatus.NotStarted) return;

    try {
      // Find the currently active sprint
      const sprintsRef = collection(db, "sprints");
      const activeSprintQuery = query(
        sprintsRef,
        where("sprintStatus", "==", SprintStatus.Active)
      );
      const activeSprintSnapshot = await getDocs(activeSprintQuery);

      // If there's an active sprint, end it
      if (!activeSprintSnapshot.empty) {
        const activeSprintDoc = activeSprintSnapshot.docs[0];
        const activeSprintRef = doc(db, "sprints", activeSprintDoc.id);
        await updateDoc(activeSprintRef, {
          sprintStatus: SprintStatus.Done,
          endDate: Timestamp.now(),
        });
      }

      // Start the current sprint
      const currentSprintRef = doc(db, "sprints", sprint.id);
      await updateDoc(currentSprintRef, {
        sprintStatus: SprintStatus.Active,
        startDate: Timestamp.now(),
      });

      setStatus(SprintStatus.Active);
      setFrom(new Date());

      toast({
        title: `${sprint.name} force started`,
        description: "The sprint has been force started and is now active.",
      });
    } catch (error) {
      console.error("Error force starting sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to force start the sprint.",
      });
    }
  };

  const handleForceEnd = async () => {
    if (status !== SprintStatus.Active) return;

    try {
      const sprintRef = doc(db, "sprints", sprint.id);
      await updateDoc(sprintRef, {
        sprintStatus: SprintStatus.Done,
        endDate: Timestamp.now(),
      });

      setStatus(SprintStatus.Done);
      setTo(new Date());

      toast({
        title: `${sprint.name} force ended`,
        description: "The sprint has been force ended and is now complete.",
      });
    } catch (error) {
      console.error("Error force ending sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to force end the sprint.",
      });
    }
  };

  const isEditable = status !== SprintStatus.Done;
  const canEditDates = status === SprintStatus.NotStarted;

  return (
    <div>
      {isEditable ? (
        <TitleEditable title={title} setTitle={setTitle} />
      ) : (
        <h2 className="text-3xl font-bold">{title}</h2>
      )}
      <div className="mt-2 font-bold">
        <SprintStatusBadge status={status} />
      </div>

      <div>
        <p className="mt-6">Sprint Start Date</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`flex space-x-4 w-40 justify-between ${
                canEditDates
                  ? ""
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              } rounded-xl mt-1`}
              disabled={!canEditDates}
            >
              <span>{format(from, "P")}</span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          {canEditDates && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={from}
                onSelect={(date) => date && setFrom(date)}
              />
            </PopoverContent>
          )}
        </Popover>
        <p className="mt-4">Sprint End Date</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={`flex space-x-4 w-40 justify-between ${
                canEditDates
                  ? ""
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              } rounded-xl mt-1`}
              disabled={!canEditDates}
            >
              <span>{format(to, "P")}</span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          {canEditDates && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={to}
                onSelect={(date) => date && setTo(date)}
              />
            </PopoverContent>
          )}
        </Popover>
      </div>

      <div className="w-full flex justify-between items-center mt-10">
        <div className="flex space-x-2">
          {status === SprintStatus.NotStarted && (
            <Button
              className="w-fit rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-lg"
              onClick={handleForceStart}
            >
              Force Start
            </Button>
          )}
          {status === SprintStatus.Active && (
            <Button
              className="w-fit rounded-2xl bg-red-500 hover:bg-red-600 shadow-lg"
              onClick={handleForceEnd}
            >
              Force End
            </Button>
          )}
        </div>
        {isEditable && (
          <Button
            className="w-fit rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg"
            onClick={handleUpdate}
          >
            UPDATE
          </Button>
        )}
      </div>
    </div>
  );
};
