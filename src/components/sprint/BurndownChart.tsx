"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Sprint } from "@/models/sprints/Sprint";
import { eachDayOfInterval, format } from "date-fns";
import { useTasks } from "@/hooks/useTasks";
import { Timestamp } from "firebase/firestore";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BurndownChartProps {
  sprint: Sprint;
  isOpen: boolean;
  onClose: () => void;
}

export const BurndownChart: React.FC<BurndownChartProps> = ({
  sprint,
  isOpen,
  onClose,
}) => {
  const allTasks = useTasks(); // Fetch all tasks
  const sprintTasks = allTasks.filter((task) =>
    sprint.taskIds?.includes(task.id)
  ); // Filter tasks for the sprint

  // Function to generate the x-axis dates for the burndown chart
  const generateSprintDates = () => {
    const start = sprint.startDate.toDate();
    const end = sprint.endDate.toDate();
    const dates = eachDayOfInterval({ start, end });
    return dates;
  };

  // Generate the formatted dates for the chart labels
  const sprintDates = generateSprintDates();
  const formattedDates = sprintDates.map((date) => format(date, "MMM dd"));

  // Calculate the total story points for all tasks
  const totalStoryPoints = sprintTasks.reduce((total, task) => {
    return total + (task.storyPoints || 0); // Default to 0 if storyPoints is not defined
  }, 0);

  // Generate the ideal burndown line
  const idealBurndown = sprintDates.map((_, index) => {
    return (
      totalStoryPoints - (totalStoryPoints / (sprintDates.length - 1)) * index
    );
  });

  // Generate the actual burndown line
  const actualBurndown = sprintDates.map((date) => {
    // Calculate remaining story points by subtracting completed tasks up to this day
    const completedStoryPoints = sprintTasks.reduce((total, task) => {
      // Ensure completedDate is a Firebase Timestamp and convert it to a Date
      if (
        task.status === "Completed" &&
        task.completedDate instanceof Timestamp
      ) {
        const completedDate = format(task.completedDate.toDate(), "yyyy-MM-dd");
        const currentDate = format(date, "yyyy-MM-dd");

        // Compare the formatted dates without the time part
        if (completedDate <= currentDate) {
          return total + (task.storyPoints || 0);
        }
      }
      return total;
    }, 0);

    // Subtract completed story points from total
    return totalStoryPoints - completedStoryPoints;
  });

  // Chart data for the burndown chart
  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: "Ideal Burndown",
        data: idealBurndown,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Actual Progress",
        data: actualBurndown,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-0 shadow-lg">
        <DialogHeader>
          <h2 className="text-lg font-bold">Burndown Chart</h2>
        </DialogHeader>
        <div className="p-4">
          {sprintTasks.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p>No tasks available for this sprint.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BurndownChart;
