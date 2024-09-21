import { SprintStatus } from "@/models/sprints/SprintStatus";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { Task } from "../Task";

export interface Sprint {
  id: string;
  name: string;
  status: SprintStatus;
  startDate: Timestamp;
  endDate: Timestamp;
  taskIds?: string[];
}
