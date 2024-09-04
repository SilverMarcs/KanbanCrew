import { History } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Member } from "@/models/Member";
import { HistoryLog } from "@/models/HistoryLog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const HistoryLogs: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [historyLog, setHistoryLog] = useState<HistoryLog[]>([]);

  // Fetch members from the database
  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(db, "members"));
      const membersData: Member[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        membersData.push({
          firstName: data.firstName,
          lastName: data.lastName,
          id: doc.id,
        });
      });

      setMembers(membersData); // Set members data
    };

    fetchMembers();
  }, []);

  // Create random history log once members have been loaded
  useEffect(() => {
    if (members.length > 0) {
      // Ensure members are loaded before creating history logs
      const newHistoryLog: HistoryLog[] = [];
      for (let i = 0; i < 3; i++) {
        newHistoryLog.push({
          id: i.toString(),
          member: members[i % members.length], // Rotate through members
          timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * 24), // Random timestamp
        });
      }
      setHistoryLog(newHistoryLog);
    }
  }, [members]);

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
      <div className="mt-2 ml-16 flex flex-col">
        {historyLog.map((log: HistoryLog) => (
          <div key={log.id} className="flex space-x-2">
            <div className="h-12 w-0.5 bg-gray-400 opacity-80"></div>
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>
                {log.member.firstName[0]}
                {log.member.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-28">
              <div className="text-xs">{getRelativeTime(log.timestamp)}</div>
              <div className="text-black font-bold">
                {log.member.firstName} {log.member.lastName}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryLogs;
