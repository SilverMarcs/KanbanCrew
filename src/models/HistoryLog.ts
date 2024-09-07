import { Member } from "./Member";

export interface HistoryLog {
  id: string;
  member: Member;
  timestamp: Date;
}
