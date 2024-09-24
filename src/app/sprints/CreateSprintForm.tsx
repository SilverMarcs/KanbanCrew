import { useState } from "react";
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
import { SprintStatusBadge } from "./SprintStatusBadge";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/hooks/use-toast";

interface CreateSprintFormProps {
  onSuccess: () => void;
}

export const CreateSprintForm: React.FC<CreateSprintFormProps> = ({
  onSuccess,
}) => {
  const [title, setTitle] = useState("New Sprint");
  const [status, setStatus] = useState<SprintStatus>(SprintStatus.NotStarted);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  const onSubmit = async () => {
    if (!from || !to) return;

    try {
      await addDoc(collection(db, "sprints"), {
        name: title,
        sprintStatus: status,
        startDate: Timestamp.fromDate(from),
        endDate: Timestamp.fromDate(to),
      });

      toast({
        title: "Sprint created",
        description: (
          <div>
            <p>Status: {status}</p>
            <p>From: {format(from, "P")}</p>
            <p>To: {format(to, "P")}</p>
          </div>
        ),
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to create the sprint.",
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
              <span>{from ? format(from, "P") : "Select date"}</span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={from} onSelect={setFrom} />
          </PopoverContent>
        </Popover>
        <p className="mt-4">Sprint End Date</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="flex space-x-4 w-40 justify-between bg-white text-black rounded-xl hover:bg-gray-100 mt-1">
              <span>{to ? format(to, "P") : "Select date"}</span>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={to} onSelect={setTo} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full flex justify-end">
        <Button
          className="w-fit rounded-2xl bg-red-500 hover:bg-red-600 shadow-lg mt-3"
          disabled={!from || !to}
          onClick={onSubmit}
        >
          CREATE
        </Button>
      </div>
    </div>
  );
};
