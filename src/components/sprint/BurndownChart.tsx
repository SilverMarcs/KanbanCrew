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
    return dates.map((date) => format(date, "MMM dd"));
  };

  // Calculate the total story points for all tasks
  const totalStoryPoints = sprintTasks.reduce((total, task) => {
    return total + (task.storyPoints || 0); // Default to 0 if storyPoints is not defined
  }, 0);

  // Generate the ideal burndown line
  const idealBurndown = generateSprintDates().map((_, index, dates) => {
    // Linear interpolation from total story points to 0 over the course of the sprint
    return totalStoryPoints - (totalStoryPoints / (dates.length - 1)) * index;
  });

  // Sample data for the burndown chart
  const chartData = {
    labels: generateSprintDates(),
    datasets: [
      {
        label: "Ideal Burndown",
        data: idealBurndown,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
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
