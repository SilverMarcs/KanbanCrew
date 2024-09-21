import { Timestamp } from "firebase/firestore";
import { Priority } from "./Priority";
import { ProjectStage } from "./ProjectStage";
import { Status } from "./Status";
import { Tag } from "./Tag";
import { Type } from "./Type";
import { HistoryLog } from "./HistoryLog";
import { Member } from "./Member";

export interface Task {
  id: string;
  index: number;
  title: string;
  storyPoints: number;
  priority: Priority;
  avatarUrl: string;
  tags: Tag[];
  assignee: Member;
  description: string;
  projectStage: ProjectStage;
  status: Status;
  type: Type;
  creationDate: Timestamp;
  historyLogs: HistoryLog[];
  sprintId?: string | null; // Changed from DocumentReference<Sprint> | null to string | null
}
