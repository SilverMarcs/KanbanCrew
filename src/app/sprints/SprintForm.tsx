import { useState } from "react";
import { TaskStatusDropdown } from "@/components/TaskStatusDropdown";
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
import { Status } from "@/models/Status";
import { SprintStatus } from "@/models/sprints/SprintStatus";
import { SprintFormProps } from "@/models/sprints/SprintFormProps";
import { TaskOrSprintStatus } from "@/components/TaskStatusDropdown";

export const SprintForm: React.FC<SprintFormProps> = ({
  initialTitle,
  initialStatus,
  initialStartDate,
  initialEndDate,
  onSubmit,
  submitButtonLabel,
  isSprint,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState<TaskOrSprintStatus>(initialStatus);
  const [from, setFrom] = useState<Date | undefined>(initialStartDate);
  const [to, setTo] = useState<Date | undefined>(initialEndDate);

  return (
    <div>
      <TitleEditable title={title} setTitle={setTitle} />
      <div className="-ml-2 mt-1">
        <TaskStatusDropdown status={status} setStatus={setStatus} isSprint={isSprint} />
      </div>

      <div>
        <p className="mt-6">{isSprint ? "Sprint Start Date" : "Task Start Date"}</p> {/* Conditional label */}
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

        <p className="mt-4">{isSprint ? "Sprint End Date" : "Task Due Date"}</p> {/* Conditional label */}
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
          onClick={() => {
            if (from && to) {
              onSubmit(title, status, from, to);
            }
          }}
        >
          {submitButtonLabel}
        </Button>
      </div>
    </div>
  );
};

