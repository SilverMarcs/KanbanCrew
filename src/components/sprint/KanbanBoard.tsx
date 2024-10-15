"use client";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskCardCompact } from "@/components/task/TaskCardCompact";
import { Task } from "@/models/Task";
import { Status } from "@/models/Status";
import { useMembers } from "@/hooks/useMembers";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Grip } from "lucide-react";
import { toast } from "../ui/use-toast";

interface KanbanBoardProps {
  tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const members = useMembers();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const columns = {
    [Status.NotStarted]: tasks.filter(
      (task) => task.status === Status.NotStarted
    ),
    [Status.InProgress]: tasks.filter(
      (task) => task.status === Status.InProgress
    ),
    [Status.Completed]: tasks.filter(
      (task) => task.status === Status.Completed
    ),
  };

  const hasTimeLogs = (task: Task): boolean => {
    return task.timeLogs && task.timeLogs.length > 0;
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId as Status;
      const task = tasks.find((t) => t.id === draggableId);

      if (!task) return;

      // Check if moving backwards to "Not Started" and task has time logs
      if (
        hasTimeLogs(task) &&
        newStatus === Status.NotStarted &&
        (task.status === Status.InProgress || task.status === Status.Completed)
      ) {
        // Don't allow the move and show a toast
        toast({
          title: "Cannot move task",
          description:
            "Cannot move task back to Not Started as it has time logged",
        });
        return;
      }

      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggableId ? { ...task, status: newStatus } : task
        )
      );

      // Update in Firebase
      updateTaskStatus(draggableId, newStatus);
    }
  };

  const updateTaskStatus = async (taskId: string, status: Status) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await updateDoc(taskRef, { status });
    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert the optimistic update if the Firebase update fails
      setTasks(initialTasks);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {Object.entries(columns).map(([status, tasks]) => (
          <div key={status} className="flex-1 min-w-[26rem] max-w-[26rem]">
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="p-4 rounded-lg min-h-[500px] kanban-board"
                >
                  <h2 className="text-xl font-semibold mb-4 drop-shadow">
                    {status}
                  </h2>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-4"
                        >
                          <TaskCardCompact
                            task={task}
                            members={members}
                            isKanbanBoard={true}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
