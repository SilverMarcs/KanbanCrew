import { History } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryLog } from "@/models/HistoryLog";
import { Member } from "@/models/Member";

const HistoryLogs: React.FC<
  { historyLogs: HistoryLog[] } & { members: Member[] }
> = ({ historyLogs, members }) => {
  const [sortedLogs, setSortedLogs] = useState<HistoryLog[]>([]);

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member
      ? { firstName: member.firstName, lastName: member.lastName }
      : { firstName: "Unknown", lastName: "Member" };
  };

  const convertToDate = (time: {
    seconds: number;
    nanoseconds: number;
  }): Date => {
    return new Date(time.seconds * 1000); // Convert seconds to milliseconds
  };

  useEffect(() => {
    const sorted = [...historyLogs].sort((a, b) => {
      return convertToDate(b.time).getTime() - convertToDate(a.time).getTime();
    });
    setSortedLogs(sorted);
  }, [historyLogs]);

  // Function to calculate relative time
  const getRelativeTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = Math.abs(now.getTime() - timestamp.getTime());
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div>
      <div className="flex space-x-2 ml-12">
        <History size={28} />
        <div className="font-semibold text-lg">History log</div>
      </div>
      <ScrollArea className="mt-2 ml-16 flex flex-col max-h-60 min-w-full">
        {sortedLogs.map((log: HistoryLog, index) => (
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
        ))}
      </ScrollArea>
    </div>
  );
};

export default HistoryLogs;
