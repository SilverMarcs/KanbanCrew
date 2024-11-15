import React from "react";
import { Sprint } from "@/models/sprints/Sprint";
import { Task } from "@/models/Task";
import { Status } from "@/models/Status";
import { TaskCardCompact } from "@/components/task/TaskCardCompact";
import { useMembers } from "@/hooks/useMembers";

interface CompletedSprintProps {
  sprint: Sprint;
  tasks: Task[];
}

const CompletedSprint: React.FC<CompletedSprintProps> = ({ sprint, tasks }) => {
  const completedTasks = tasks.filter(
    (task) => task.status === Status.Completed
  );

  const columns = {
    [Status.NotStarted]: [], // Empty because the sprint is completed
    [Status.InProgress]: [], // Empty because the sprint is completed
    [Status.Completed]: completedTasks,
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">
        Completed Sprint: {sprint.name}
      </h2>
      <div className="flex space-x-4">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div
            key={status}
            className="flex-1 min-w-[26rem] max-w-[26rem] grayed-out" // Apply "grayed-out" class to all columns
          >
            <div className="p-4 rounded-lg min-h-[500px] kanban-board">
              <h2 className="text-xl font-semibold mb-4 drop-shadow">
                {status}
              </h2>
              {columnTasks.map((task) => (
                <div key={task.id} className="mb-4">
                  <TaskCardCompact
                    task={task}
                    isKanbanBoard={true}
                    isEditable={false}
                  />
                </div>
              ))}
              {columnTasks.length === 0 && (
                <p className="text-muted-foreground italic">
                  No tasks in this status
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedSprint;
