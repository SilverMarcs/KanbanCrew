import { DocumentReference, Timestamp } from "@firebase/firestore";

export interface HistoryLog {
  member: DocumentReference;
  time: Timestamp;
}
