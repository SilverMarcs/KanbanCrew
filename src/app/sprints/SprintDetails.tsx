// SprintDetailsView.tsx
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
import { SprintStatusDropdown } from "./SprintStatusDropdown";
import { Sprint } from "@/models/sprints/Sprint";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/hooks/use-toast";

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
        sprintStatus: status,
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

  return (
    <div>
      <TitleEditable title={title} setTitle={setTitle} />
      <div className="-ml-2 mt-1">
        <SprintStatusDropdown status={status} setStatus={setStatus} />
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

      <div className="w-full flex justify-end">
        <Button
          className="w-fit rounded-2xl bg-red-500 hover:bg-red-600 shadow-lg mt-3"
          onClick={handleUpdate}
        >
          UPDATE
        </Button>
      </div>
    </div>
  );
};
