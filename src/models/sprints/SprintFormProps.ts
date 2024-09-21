import { TaskOrSprintStatus } from "@/components/TaskStatusDropdown";

export interface SprintFormProps {
  initialTitle: string;
  initialStatus: TaskOrSprintStatus; // Updated type
  initialStartDate?: Date;
  initialEndDate?: Date;
  onSubmit: (title: string, status: TaskOrSprintStatus, from: Date, to: Date) => void; // Updated type
  submitButtonLabel: string;
  isSprint: boolean;
}
