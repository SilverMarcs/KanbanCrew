import { Timer } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeLog } from "@/models/TimeLog";
import { Member } from "@/models/Member";
import { convertToDate, getRelativeTime } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";

const TimeLogs: React.FC<{ timeLogs: TimeLog[] } & { members: Member[] }> = ({
  timeLogs,
  members,
}) => {
  const [sortedLogs, setSortedLogs] = useState<TimeLog[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hours, setHours] = useState<string>("00");
  const [minutes, setMinutes] = useState<string>("00");
  const [seconds, setSeconds] = useState<string>("00");

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member
      ? { firstName: member.firstName, lastName: member.lastName }
      : { firstName: "Unknown", lastName: "Member" };
  };

  useEffect(() => {
    if (!timeLogs) {
      return;
    }
    const sorted = [...timeLogs].sort((a, b) => {
      return a.time.toDate().getTime() - b.time.toDate().getTime();
    });
    setSortedLogs(sorted);

    // Calculate the total time spent from the time logs
    const totalTime = sorted.reduce((total, log) => total + log.timeLogged, 0);
    setTimeSpent(totalTime);
  }, [timeLogs]);

  const handleLogTime = () => {
    // Default values are used if the user leaves any input empty
    const hrs = parseInt(hours, 10) || 0;
    const mins = parseInt(minutes, 10) || 0;
    const secs = parseInt(seconds, 10) || 0;
    const totalSeconds = hrs * 3600 + mins * 60 + secs;

    setTimeSpent((prevTimeSpent) => prevTimeSpent + totalSeconds);

    // Reset the input fields to default values after logging time
    setHours("00");
    setMinutes("00");
    setSeconds("00");
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
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log: TimeLog, index) => (
            <div key={index} className="flex space-x-2">
              <div className="h-12 w-0.5 mr-0.5 bg-gray-400 opacity-80"></div>
              <Avatar>
                <AvatarImage src={""} />
                <AvatarFallback>
                  {getMemberName(log.member.id).firstName[0]}
                  {getMemberName(log.member.id).lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-28">
                <div className="text-xs">
                  {getRelativeTime(log.time.toDate())}
                </div>
                <div className="text-black font-bold">
                  {getMemberName(log.member.id).firstName}{" "}
                  {getMemberName(log.member.id).lastName}
                </div>
                <div className="text-gray-500">
                  Time logged: {formatTime(log.timeLogged)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex space-x-2">
            <div className="h-12 w-0.5 mr-0.5 bg-gray-400 opacity-80"></div>
            <div className="text-center text-gray-500 mt-4">
              No logs available
            </div>
          </div>
        )}
      </ScrollArea>
      <Popover>
        <PopoverTrigger asChild className="space-x-2 ml-12 border">
          <Button className="flex space-x-4 w-52 h-10 justify-between bg-white text-black rounded-xl hover:bg-gray-100 mt-1">
            <span>{date ? format(date, "P") : "Select date"}</span>
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
      <div className="flex ml-12 mt-2 items-center justify-center">
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
