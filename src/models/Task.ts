import { Timestamp } from "firebase/firestore";
import { Priority } from "./Priority";
import { ProjectStage } from "./ProjectStage";
import { Status } from "./Status";
import { Tag } from "./Tag";
import { Type } from "./Type";
import { Member } from "./Member";

export interface Task {
  id: string;
  index: number;
  title: string;
  storyPoints: number;
  priority: Priority;
  avatarUrl: string;
  tags: Tag[];
  assignee: string;
  description: string;
  projectStage: ProjectStage;
  status: Status;
  type: Type;
  creationDate: Timestamp;
  historyLogs: HistoryLog[];
}

export interface HistoryLog {
  id: string;
  member: Member;
  timestamp: Date;
}
