import { DocumentReference } from "@firebase/firestore";

export interface HistoryLog {
  member: DocumentReference;
  time: TimeStamp;
}

export interface TimeStamp {
  seconds: number;
  nanoseconds: number;
}
