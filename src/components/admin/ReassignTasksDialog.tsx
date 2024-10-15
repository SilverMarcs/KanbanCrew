// components/ReassignTasksDialog.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AssigneeField } from "@/components/task/taskEditors/AssigneeField";
import { Task } from "@/models/Task";
import { Member } from "@/models/Member";
import { useTasks } from "@/hooks/useTasks";
import { TaskCardCompact } from "../task/TaskCardCompact";

interface ReassignTasksDialogProps {
  member: Member;
  onClose: () => void;
  onComplete: () => void;
}

export const ReassignTasksDialog: React.FC<ReassignTasksDialogProps> = ({
  member,
  onClose,
  onComplete,
}) => {
  const [tasksToReassign, setTasksToReassign] = useState<Task[]>([]);
  const allTasks = useTasks();

  useEffect(() => {
    const filteredTasks = allTasks.filter(
      (task) => task.assignee.id === member.id
    );
    setTasksToReassign(filteredTasks);
  }, [allTasks, member.id]);

  const handleReassign = (task: Task, newAssignee: Member) => {
    setTasksToReassign((prev) => prev.filter((t) => t.id !== task.id));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign Tasks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {tasksToReassign.length > 0 ? (
            <>
              <p>
                Please reassign the following tasks before deleting this member:
              </p>
              {tasksToReassign.map((task) => (
                <div key={task.id} className="border p-4 rounded-md">
                  {/* <h3 className="font-semibold text-lg">{task.title}</h3> */}
                  <TaskCardCompact task={task} isEditable={false} />
                  <AssigneeField
                    assignee={task.assignee}
                    setAssignee={(newAssignee) =>
                      handleReassign(task, newAssignee)
                    }
                    taskId={task.id}
                  />
                </div>
              ))}
            </>
          ) : (
            <p>
              All tasks have been reassigned. You can now delete this member.
            </p>
          )}
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={onComplete} disabled={tasksToReassign.length > 0}>
              Complete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
