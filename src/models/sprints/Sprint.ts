import { Status } from "../Status";
import { Timestamp } from "firebase/firestore";

export interface Sprint {
  id: string;
  name: string;
  status: Status;
  startDate: Timestamp;
  endDate: Timestamp;
}
