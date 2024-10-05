import { History } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryLog } from "@/models/HistoryLog";
import { Member } from "@/models/Member";
import { convertToDate, getRelativeTime, getMemberName } from "@/lib/utils";

const HistoryLogs: React.FC<
  { historyLogs: HistoryLog[] } & { members: Member[] }
> = ({ historyLogs, members }) => {
  const [sortedLogs, setSortedLogs] = useState<HistoryLog[]>([]);

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
        <History size={28} />
        <div className="font-semibold text-lg">History log</div>
      </div>

      <ScrollArea className="mt-2 ml-16 flex flex-col max-h-60 min-w-full">
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log: HistoryLog, index) => (
            <div key={index} className="flex space-x-2">
              <div className="h-12 w-0.5 mr-0.5 bg-gray-400 opacity-80"></div>
              <Avatar>
                <AvatarImage src={""} />
                <AvatarFallback>
                  {getMemberName(members, log.member.id).firstName[0]}
                  {getMemberName(members, log.member.id).lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-28">
                <div className="text-xs">
                  {getRelativeTime(convertToDate(log.time))}
                </div>
                <div className="text-muted-foreground font-bold">
                  {getMemberName(members, log.member.id).firstName}{" "}
                  {getMemberName(members, log.member.id).lastName}
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
    </div>
  );
};

export default HistoryLogs;
