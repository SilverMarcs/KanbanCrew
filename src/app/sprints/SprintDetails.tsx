import { useState, useEffect } from "react";
import { TitleEditable } from "@/components/TitleEditable";
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
    try {
      const sprintRef = doc(db, "sprints", sprint.id);
      await updateDoc(sprintRef, {
        name: title,
        startDate: Timestamp.fromDate(from),
        endDate: Timestamp.fromDate(to),
      });

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

      toast({
        title: `${sprint.name} force started`,
        description: "The sprint has been force started and is now active.",
      });
      onClose();
    } catch (error) {
      console.error("Error force starting sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to force start the sprint.",
      });
    }
  };

  const handleForceEnd = async () => {
    try {
      const sprintRef = doc(db, "sprints", sprint.id);
      await updateDoc(sprintRef, {
        sprintStatus: SprintStatus.Done,
        endDate: Timestamp.now(),
      });

      toast({
        title: `${sprint.name} force ended`,
        description: "The sprint has been force ended and is now complete.",
      });
      onClose();
    } catch (error) {
      console.error("Error force ending sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to force end the sprint.",
      });
    }
  };

  return (
    <div>
      <TitleEditable title={title} setTitle={setTitle} />
      <div className="mt-2">
        <SprintStatusBadge status={status} />
      </div>

      <div>
        <p className="mt-6">Sprint Start Date</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex space-x-4 w-40 justify-between bg-white text-black rounded-xl hover:bg-gray-100 mt-1">
              <span>{format(from, "P")}</span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={from}
              onSelect={(date) => date && setFrom(date)}
            />
          </PopoverContent>
        </Popover>
        <p className="mt-4">Sprint End Date</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex space-x-4 w-40 justify-between bg-white text-black rounded-xl hover:bg-gray-100 mt-1">
              <span>{format(to, "P")}</span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={to}
              onSelect={(date) => date && setTo(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full flex justify-between items-center mt-10">
        <div className="flex space-x-2">
          <Button
            className="w-fit rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-lg"
            onClick={handleForceStart}
          >
            Force Start
          </Button>
          <Button
            className="w-fit rounded-2xl bg-red-500 hover:bg-red-600 shadow-lg"
            onClick={handleForceEnd}
          >
            Force End
          </Button>
        </div>
        <Button
          className="w-fit rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg"
          onClick={handleUpdate}
        >
          UPDATE
        </Button>
      </div>
    </div>
  );
};
