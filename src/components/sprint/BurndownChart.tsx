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
  // Function to generate the x-axis dates for the burndown chart
  const generateSprintDates = () => {
    const start = sprint.startDate.toDate();
    const end = sprint.endDate.toDate();
    const dates = eachDayOfInterval({ start, end });
    return dates.map((date) => format(date, "MMM dd"));
  };

  // Sample data for the burndown chart
  const chartData = {
    labels: generateSprintDates(),
    datasets: [
      {
        label: "Work Remaining",
        data: Array(generateSprintDates().length).fill(100),
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
          <Line data={chartData} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BurndownChart;
