import { SprintStatus } from "./SprintStatus";

export interface SprintFormProps {
  initialTitle: string;
  initialStatus: SprintStatus;
  initialStartDate?: Date;
  initialEndDate?: Date;
  onSubmit: (title: string, status: SprintStatus, from: Date, to: Date) => void;
  submitButtonLabel: string;
  sprintId?: string;
}
