import { Status } from "../Status";

export interface SprintFormProps {
  initialTitle: string;
  initialStatus: Status;
  initialStartDate?: Date;
  initialEndDate?: Date;
  onSubmit: (title: string, status: Status, from: Date, to: Date) => void;
  submitButtonLabel: string;
}
