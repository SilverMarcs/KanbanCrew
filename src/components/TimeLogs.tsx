import { Timer } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryLog } from "@/models/HistoryLog";
import { Member } from "@/models/Member";
import { convertToDate, getRelativeTime } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const TimeLogs: React.FC<
  { historyLogs: HistoryLog[] } & { members: Member[] }
> = ({ historyLogs, members }) => {
  const [sortedLogs, setSortedLogs] = useState<HistoryLog[]>([]);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(new Date());

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
    if (!historyLogs) {
      return;
    }
    const sorted = [...historyLogs].sort((a, b) => {
      return convertToDate(b.time).getTime() - convertToDate(a.time).getTime();
    });
    setSortedLogs(sorted);
  }, [historyLogs]);

  return (
    <div>
      <div className="flex space-x-2 ml-12">
        <Timer />
        <div className="font-semibold text-lg">
          Time logs - {formatTime(timeSpent)}
        </div>
      </div>

      <ScrollArea className="mt-2 ml-16 mb-4 flex flex-col min-h-40 max-h-40 min-w-full">
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log: HistoryLog, index) => (
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
                  {getRelativeTime(convertToDate(log.time))}
                </div>
                <div className="text-black font-bold">
                  {getMemberName(log.member.id).firstName}{" "}
                  {getMemberName(log.member.id).lastName}
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
      <div className="flex space-x-2 ml-12 mt-2 w-52">
        <input
          type="text"
          placeholder="HH:MM:SS"
          className="border rounded-xl p-2 w-full"
          onChange={(e) => {
            const timeParts = e.target.value.split(":");
            if (timeParts.length === 3) {
              const hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1], 10);
              const seconds = parseInt(timeParts[2], 10);
              if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                setTimeSpent((prevTimeSpent) => prevTimeSpent + totalSeconds);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default TimeLogs;
