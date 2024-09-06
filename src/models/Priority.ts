export enum Priority {
  Important = "Important",
  Urgent = "Urgent",
  Low = "Low",
}

// Define a numeric mapping for priority levels
export const PriorityOrder = {
  [Priority.Urgent]: 1,
  [Priority.Important]: 2,
  [Priority.Low]: 3,
};

export const getPriorityColor = (priority: Priority): ColorScheme => {
  return PriorityColors[priority];
};

export const PriorityColors: Record<Priority, ColorScheme> = {
  [Priority.Important]: {
    bgColor: "bg-orange-300",
    textColor: "text-orange-600",
  },
  [Priority.Urgent]: { bgColor: "bg-red-300", textColor: "text-red-600" },
  [Priority.Low]: { bgColor: "bg-green-300", textColor: "text-green-600" },
};
