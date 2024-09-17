import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { Status } from "@/models/Status";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { TaskStatusDropdown } from "@/components/TaskStatusDropdown";
import { TitleEditable } from "@/components/TitleEditable";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export const CreateSprintCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [title, setTitle] = useState("New Sprint");
  const [status, setStatus] = useState<Status>(Status.NotStarted);

  const onSubmit = async (from: Date, to: Date) => {
    try {
      await addDoc(collection(db, "sprints"), {
        name: title,
        sprintStatus: status,
        startDate: Timestamp.fromDate(from),
        endDate: Timestamp.fromDate(to),
      });

      toast({
        title: `${title} created`,
        description: (
          <div>
            <p>From: {format(from, "P")}</p>
            <p>To: {format(to, "P")}</p>
          </div>
        ),
      });
    } catch (error) {
      console.error("Error adding sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to create the sprint.",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <DialogTrigger className="w-full" onClick={() => setIsOpen(true)}>
        <Card className="rounded-xl border-dashed border-2 border-gray-300 bg-transparent h-full">
          <CardContent className="flex justify-center h-full items-center py-2">
            <PlusCircleIcon size={40} className="text-gray-300" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-yellow-200 max-w-lg border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex flex-col justify-start items-start space-y-2">
            <TitleEditable title={title} setTitle={setTitle} />
            <div className="-ml-2">
              <TaskStatusDropdown status={status} setStatus={setStatus} />
            </div>
          </DialogTitle>
          <div>
            <p className="mt-6">From</p>
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
            <p className="mt-4">To</p>
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
          <Button
            className="w-fit self-end rounded-2xl bg-red-500 hover:bg-red-600 shadow-lg"
            disabled={!from || !to}
            onClick={() => {
              if (from && to) {
                onSubmit(from, to);
                setIsOpen(false);
              }
            }}
          >
            CREATE
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
