import { Sprint } from "@/models/sprints/Sprint";
import { differenceInDays, isBefore, isAfter, startOfDay } from "date-fns";

const validateSprintDates = (
  startDate: Date,
  endDate: Date,
  existingSprints: Sprint[]
): string[] => {
  const errors: string[] = [];
  const today = startOfDay(new Date());

  // Check if end date is before start date
  if (isBefore(endDate, startDate)) {
    errors.push("End date cannot be before start date.");
  }

  // Check minimum sprint duration (e.g., 1 day)
  if (differenceInDays(endDate, startDate) < 1) {
    errors.push("Sprint must be at least 1 day long.");
  }

  //   // Check maximum sprint duration (e.g., 30 days)
  //   if (differenceInDays(endDate, startDate) > 30) {
  //     errors.push("Sprint cannot be longer than 30 days.");
  //   }

  // Check if sprint starts in the past
  if (isBefore(startDate, today)) {
    errors.push("Sprint cannot start in the past.");
  }

  // Check for overlaps with existing sprints
  const hasOverlap = existingSprints.some((sprint) => {
    const sprintStart = sprint.startDate.toDate();
    const sprintEnd = sprint.endDate.toDate();
    return (
      (isAfter(startDate, sprintStart) && isBefore(startDate, sprintEnd)) ||
      (isAfter(endDate, sprintStart) && isBefore(endDate, sprintEnd)) ||
      (isBefore(startDate, sprintStart) && isAfter(endDate, sprintEnd)) ||
      startDate.getTime() === sprintStart.getTime() ||
      endDate.getTime() === sprintEnd.getTime()
    );
  });

  if (hasOverlap) {
    errors.push("Sprint dates overlap with an existing sprint.");
  }

  return errors;
};

export default validateSprintDates;
