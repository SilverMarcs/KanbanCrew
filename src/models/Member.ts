import { Timestamp } from "@firebase/firestore";

export interface Member {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  hoursWorked: { date: Timestamp; hours: number }[];
}
