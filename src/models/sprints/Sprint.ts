import { Status } from "../Status";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { Task } from "../Task";

export interface Sprint {
  id: string;
  name: string;
  status: Status;
  startDate: Timestamp;
  endDate: Timestamp;
  taskIds?: string[];
}
