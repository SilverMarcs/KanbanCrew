"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, subDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // ShadCN Dialog components

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EffortGraphProps {
  hoursWorked: { date: firebase.firestore.Timestamp; hours: number }[];
  open: boolean;
  onClose: () => void;
}

export const EffortGraph = ({
  hoursWorked,
  open,
  onClose,
}: EffortGraphProps) => {
  // Get the past 7 days, including today
  const past7Days = Array.from({ length: 7 })
    .map((_, index) => subDays(new Date(), index))
    .reverse();

  // Map data to be used in the chart
  const chartData = past7Days.map((date) => {
    const entry = hoursWorked.find(
      (entry) =>
        format(entry.date.toDate(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    return entry ? entry.hours : 0;
  });

  // Prepare chart.js data
  const data = {
    labels: past7Days.map((date) => format(date, "MMM dd")),
    datasets: [
      {
        label: "Hours Worked",
        data: chartData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours Worked",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Effort Graph - Last 7 Days</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Bar data={data} options={options} />
        </div>
        <DialogClose onClick={onClose} />
      </DialogContent>
    </Dialog>
  );
};
