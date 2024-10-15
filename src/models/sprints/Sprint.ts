import { SprintStatus } from "@/models/sprints/SprintStatus";
import { Timestamp } from "firebase/firestore";

export interface Sprint {
  id: string;
  name: string;
  status: SprintStatus;
  startDate: Timestamp;
  endDate: Timestamp;
  taskIds?: string[];
}
