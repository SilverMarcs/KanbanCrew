import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskCardProps } from "../components/TaskCard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to map tags to their respective colors
export const getTagColor = (tag: TaskCardProps["tag"]) => {
  switch (tag) {
    case "Frontend":
      return { bgColor: "bg-blue-300", textColor: "text-blue-600" };
    case "Backend":
      return { bgColor: "bg-green-300", textColor: "text-green-600" };
    case "API":
      return { bgColor: "bg-yellow-300", textColor: "text-yellow-600" };
    case "Database":
      return { bgColor: "bg-red-300", textColor: "text-red-600" };
    case "Testing":
      return { bgColor: "bg-purple-300", textColor: "text-purple-600" };
    case "UI/UX":
      return { bgColor: "bg-pink-300", textColor: "text-pink-600" };
    case "Framework":
      return { bgColor: "bg-indigo-300", textColor: "text-indigo-600" };
    default:
      return { bgColor: "bg-gray-300", textColor: "text-gray-600" };
  }
};

// Function to map priorities to their respective colors
export const getPriorityColor = (priority: TaskCardProps["priority"]) => {
  switch (priority) {
    case "Important":
      return { bgColor: "bg-orange-400", textColor: "text-orange-800" };
    case "Urgent":
      return { bgColor: "bg-red-400", textColor: "text-red-800" };
    case "Low":
      return { bgColor: "bg-green-300", textColor: "text-green-600" };
    default:
      return { bgColor: "bg-gray-300", textColor: "text-gray-600" };
  }
};
