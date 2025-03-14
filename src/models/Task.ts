import { Timestamp } from "firebase/firestore";
import { Priority } from "./Priority";
import { ProjectStage } from "./ProjectStage";
import { Status } from "./Status";
import { Tag } from "./Tag";
import { Type } from "./Type";
import { HistoryLog } from "./HistoryLog";
import { TimeLog } from "./TimeLog";
import { Member } from "./Member";

export interface Task {
  id: string;
  index: number;
  title: string;
  storyPoints: number;
  priority: Priority;
  tags: Tag[];
  assignee: Member;
  description: string;
  projectStage: ProjectStage;
  status: Status;
  type: Type;
  creationDate: Timestamp;
  completedDate?: Timestamp | null;
  historyLogs: HistoryLog[];
  timeLogs: TimeLog[];
  sprintId?: string | null;
}
