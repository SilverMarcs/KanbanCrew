import { DocumentReference, Timestamp } from "@firebase/firestore";

export interface TimeLog {
  member: DocumentReference;
  time: Timestamp; // Using Firebase's Timestamp
  timeLogged: number; // Time logged in seconds
}
