"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { SprintDetails } from "./SprintDetails";
import { Sprint } from "@/models/sprints/Sprint";
import { doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { toast } from "@/components/ui/use-toast";
import { EllipsisVertical, LineChart, Pencil, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { SprintStatusBadge } from "./SprintStatusBadge";
import Link from "next/link";
import BurndownChart from "./BurndownChart";

interface SprintCardProps {
  sprint: Sprint;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBurndownOpen, setIsBurndownOpen] = useState(false); // State for burndown chart

  const confirmDelete = async () => {
    try {
      // Update all tasks associated with this sprint
      const taskUpdatePromises = (sprint.taskIds || []).map(async (taskId) => {
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          // Remove sprintId from the task
          return updateDoc(taskRef, { sprintId: null });
        }
      });

      // Wait for all task updates to complete
      await Promise.all(taskUpdatePromises);

      // Delete the sprint
      const sprintRef = doc(db, "sprints", sprint.id);
      await deleteDoc(sprintRef);

      toast({
        title: `${sprint.name} deleted`,
        description:
          "The sprint has been deleted and associated tasks have been updated.",
      });
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting sprint: ", error);
      toast({
        title: "Error",
        description: "Failed to delete the sprint or update associated tasks.",
      });
    }
  };

  const getSprintRoute = () => {
    switch (sprint.status) {
      case "Not Started":
        return `/sprints/${sprint.id}/backlog`;
      case "Active":
        return `/sprints/${sprint.id}/kanban`;
      case "Done":
        return `/sprints/${sprint.id}/completed`;
      default:
        return `/sprints/${sprint.id}`;
    }
  };

  return (
    <div className="w-full">
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this sprint? This action cannot be undone."
        confirmButtonLabel="Delete"
        cancelButtonLabel="Cancel"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Card key={sprint.id} className="flex items-center w-full rounded-xl">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-1 hover:bg-transparent focus:ring-0 focus:outline-none"
              >
                <EllipsisVertical
                  className="bg-transparent hover:bg-transparent"
                  size={20}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => setIsOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Sprint
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsDeleteConfirmOpen(true)}
                className="text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-full">
            <Link href={getSprintRoute()}>
              <div className="px-6 py-4 flex items-center cursor-pointer w-full">
                <div className="flex-1 text-xl font-extrabold">
                  {sprint.name}
                </div>
                <div className="flex-1 text-center font-bold">
                  <SprintStatusBadge status={sprint.status} />
                </div>
                <p className="flex-1 text-sm text-muted-foreground text-right">
                  {sprint.startDate.toDate().toLocaleDateString()} -{" "}
                  {sprint.endDate.toDate().toLocaleDateString()}
                </p>
              </div>
            </Link>
          </div>
          {/* LineChart icon for Burndown chart */}
          <Button
            variant="ghost"
            className="mr-2"
            onClick={(e) => {
              setIsBurndownOpen(true);
            }}
          >
            <LineChart size={20} />
          </Button>
        </Card>

        <DialogContent className="max-w-lg border-0 shadow-lg">
          <DialogHeader>
            <SprintDetails sprint={sprint} onClose={() => setIsOpen(false)} />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Burndown Chart for the Sprint */}
      <BurndownChart
        sprint={sprint}
        isOpen={isBurndownOpen}
        onClose={() => setIsBurndownOpen(false)}
      />
    </div>
  );
};

export default SprintCard;
