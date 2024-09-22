import { SprintStatus } from "./SprintStatus";

export interface SprintFormProps {
  initialTitle: string;
  initialStatus: SprintStatus; // Updated type
  initialStartDate?: Date;
  initialEndDate?: Date;
  onSubmit: (title: string, status: SprintStatus, from: Date, to: Date) => void; // Updated type
  submitButtonLabel: string;
  isSprint: boolean;
}
