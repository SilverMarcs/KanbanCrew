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
import { TaskOrSprintStatus } from "@/components/TaskStatusDropdown";
import { SprintFormProps } from "@/models/sprints/SprintFormProps";

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
  const [tempStatus, setTempStatus] = useState<TaskOrSprintStatus>(initialStatus);
  const [from, setFrom] = useState<Date | undefined>(initialStartDate);
  const [to, setTo] = useState<Date | undefined>(initialEndDate);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [forceActionType, setForceActionType] = useState<"start" | "end">();

  const handleStatusChange = (newStatus: TaskOrSprintStatus) => {
    if (status === "Not Started" && newStatus === "Active") {
      // Force-start logic
      setTempStatus(newStatus);
      setForceActionType("start");
      setShowConfirmDialog(true);
    } else if (newStatus === "Done" && status !== "Done") {
      // Force-end logic
      setTempStatus(newStatus);
      setForceActionType("end");
      setShowConfirmDialog(true);
    } else {
      setStatus(newStatus);
    }
  };

  const confirmForceAction = () => {
    const today = new Date();

    if (forceActionType === "start") {
      setFrom(today); // Set Start Date to today
      setStatus(tempStatus); // Change status to "Active"
    } else if (forceActionType === "end") {
      setTo(today); // Set End Date to today
      setStatus(tempStatus); // Change status to "Done"
    }

    setShowConfirmDialog(false);
  };

  return (
    <div>
      <TitleEditable title={title} setTitle={setTitle} />
      <div className="-ml-2 mt-1">
        <TaskStatusDropdown status={status} setStatus={handleStatusChange} isSprint={isSprint} />
      </div>

      <div>
        <p className="mt-6">{isSprint ? "Sprint Start Date" : "Task Start Date"}</p>
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

        <p className="mt-4">{isSprint ? "Sprint End Date" : "Task Due Date"}</p>
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

      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4">
              {forceActionType === "start"
                ? "This will forcefully START the sprint ahead of the calendar, proceed?"
                : "This will forcefully END the sprint ahead of the calendar, proceed?"}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg"
                onClick={confirmForceAction}
              >
                {forceActionType === "start" ? "Start!" : "End!"}
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                onClick={() => setShowConfirmDialog(false)}  // Close without changes
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};