import { Timer } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeLog } from "@/models/TimeLog";
import { Member } from "@/models/Member";
import { getRelativeTime } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { getMemberName, formatTime } from "@/lib/utils";
import { db } from "@/lib/firebaseConfig";
import { updateDoc, Timestamp, doc, getDoc } from "firebase/firestore";

interface TimeLogsProps {
  timeLogs: TimeLog[];
  members: Member[];
  taskId: string;
  assignee: Member;
}

const TimeLogs: React.FC<TimeLogsProps> = ({
  timeLogs,
  members,
  taskId,
  assignee,
}) => {
  const [filteredLogs, setFilteredLogs] = useState<TimeLog[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  useEffect(() => {
    if (!timeLogs || !date) {
      return;
    }

    // Filter logs based on the selected date
    const filtered = timeLogs.filter(
      (log) =>
        isSameDay(log.time.toDate(), date) && log.member.id === assignee.id
    );
    setFilteredLogs(filtered);

    // Calculate the total time spent from the filtered logs
    const totalTime = filtered.reduce(
      (total, log) => total + log.timeLogged,
      0
    );
    setTimeSpent(totalTime);
  }, [timeLogs, date, assignee]);

  const handleLogTime = async () => {
    // Default values are used if the user leaves any input empty
    const hrs = parseInt(hours, 10) || 0;
    const mins = parseInt(minutes, 10) || 0;
    const secs = parseInt(seconds, 10) || 0;
    const totalSeconds = hrs * 3600 + mins * 60 + secs;

    setTimeSpent((prevTimeSpent) => prevTimeSpent + totalSeconds);

    const taskRef = doc(db, "tasks", taskId);

    // Convert date to Firebase Timestamp
    const firebaseTimestamp = Timestamp.fromDate(date || new Date());

    // Convert assignee to a DocumentReference
    const assigneeRef = doc(db, "members", assignee.id); // Replace with actual assignee object

    const newLog = {
      member: assigneeRef,
      time: firebaseTimestamp,
      timeLogged: totalSeconds,
    };

    try {
      // Push to Firebase
      await updateDoc(taskRef, {
        timeLogs: [
          ...timeLogs, // Existing logs
          newLog,
        ],
      });

      // Update filtered logs
      setFilteredLogs([...filteredLogs, newLog]);

      // Reset the input fields to default values after logging time
      setHours("00");
      setMinutes("00");
      setSeconds("00");
    } catch (error) {
      console.error("Error updating time logs:", error);
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    const paddedValue = value.padStart(2, "0").slice(-2); // Always keep it two digits
    setter(paddedValue);
  };

  return (
    <div>
      <div className="flex space-x-2 ml-12">
        <Timer />
        <div className="font-semibold text-lg">
          Time logs - {formatTime(timeSpent)}
        </div>
      </div>

      <ScrollArea className="mt-2 ml-16 mb-5 flex flex-col max-h-40 min-w-full">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log: TimeLog, index) => (
            <div key={index} className="flex space-x-2">
              <div className="h-12 w-0.5 mr-0.5 bg-gray-400 opacity-80"></div>
              <Avatar>
                <AvatarImage src={""} />
                <AvatarFallback>
                  {getMemberName(members, assignee.id).firstName[0]}
                  {getMemberName(members, assignee.id).lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-28">
                <div className="text-xs">
                  {getRelativeTime(log.time.toDate())}
                </div>
                <div className="flex items-center space-x-1">
                  <div className="text-black font-bold">
                    {getMemberName(members, assignee.id).firstName}{" "}
                    {getMemberName(members, assignee.id).lastName}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    - {formatTime(log.timeLogged)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex space-x-2">
            <div className="h-12 w-0.5 mr-0.5 bg-gray-400 opacity-80"></div>
            <div className="text-center text-muted-foreground mt-4">
              No logs available
            </div>
          </div>
        )}
      </ScrollArea>
      <Popover>
        <PopoverTrigger asChild className="space-x-2 ml-12 border">
          <Button className="flex space-x-4 w-52 h-10 justify-between bg-white text-muted-foreground rounded-xl hover:bg-gray-100 mt-1">
            <span>{date ? format(date, "P") : "Select date"}</span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
      <div className="flex ml-14 mt-2 items-center">
        <input
          type="number"
          placeholder="HH"
          value={hours}
          min={0}
          max={24}
          className="rounded-md p-1 w-9 text-center no-arrows focus:outline-none border-b-2 mr-2"
          onChange={(e) => handleInputChange(setHours, e.target.value)}
        />
        <div>:</div>
        <input
          type="number"
          placeholder="MM"
          value={minutes}
          min={0}
          max={59}
          className="rounded-md p-1 w-9 text-center no-arrows focus:outline-none border-b-2 mx-2"
          onChange={(e) => handleInputChange(setMinutes, e.target.value)}
        />
        <div>:</div>
        <input
          type="number"
          placeholder="SS"
          value={seconds}
          min={0}
          max={59}
          className="rounded-md p-1 w-9 text-center no-arrows focus:outline-none border-b-2 mx-2"
          onChange={(e) => handleInputChange(setSeconds, e.target.value)}
        />
        <Button
          className="rounded-full p-2 ml-2 bg-green-400 hover:bg-green-600"
          onClick={handleLogTime}
        >
          <Plus className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default TimeLogs;
