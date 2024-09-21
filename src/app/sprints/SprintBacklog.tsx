import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { Task } from "@/models/Task";
import { Sprint } from "@/models/sprints/Sprint";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Grip } from "lucide-react";
import { TaskCardCompact } from "@/components/TaskCardCompact";

interface SprintBacklogProps {
  sprint: Sprint;
}

const SprintBacklog: React.FC<SprintBacklogProps> = ({ sprint }) => {
  const allTasks = useTasks();
  const [productBacklogTasks, setProductBacklogTasks] = useState<Task[]>([]);
  const [sprintBacklogTasks, setSprintBacklogTasks] = useState<Task[]>([]);

  useEffect(() => {
    setProductBacklogTasks(allTasks.filter((task) => !task.sprintId));
    setSprintBacklogTasks(
      allTasks.filter((task) => task.sprintId === sprint.id)
    );
  }, [allTasks, sprint.id]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const isProductToSprint = source.droppableId === "ProductBacklog";
      const newSprintId = isProductToSprint ? sprint.id : null;

      // Optimistic update for tasks
      setProductBacklogTasks((prevTasks) =>
        isProductToSprint
          ? prevTasks.filter((task) => task.id !== draggableId)
          : [
              {
                ...allTasks.find((task) => task.id === draggableId)!,
                sprintId: null,
              },
              ...prevTasks,
            ]
      );

      setSprintBacklogTasks((prevTasks) =>
        isProductToSprint
          ? [
              {
                ...allTasks.find((task) => task.id === draggableId)!,
                sprintId: sprint.id,
              },
              ...prevTasks,
            ]
          : prevTasks.filter((task) => task.id !== draggableId)
      );

      // Update Firestore
      updateTaskInFirestore(draggableId, newSprintId, sprint.id);
    }
  };

  const updateTaskInFirestore = async (
    taskId: string,
    newSprintId: string | null,
    sprintId: string
  ) => {
    const taskRef = doc(db, "tasks", taskId);
    const sprintRef = doc(db, "sprints", sprintId);

    try {
      await updateDoc(taskRef, { sprintId: newSprintId });

      if (newSprintId) {
        await updateDoc(sprintRef, {
          taskIds: sprintBacklogTasks.map((t) => t.id).concat(taskId),
        });
      } else {
        await updateDoc(sprintRef, {
          taskIds: sprintBacklogTasks
            .filter((t) => t.id !== taskId)
            .map((t) => t.id),
        });
      }
    } catch (error) {
      console.error("Error updating task or sprint:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        <TaskColumn
          title="Product Backlog"
          tasks={productBacklogTasks}
          droppableId="ProductBacklog"
        />
        <TaskColumn
          title="Sprint Backlog"
          tasks={sprintBacklogTasks}
          droppableId="SprintBacklog"
        />
      </div>
    </DragDropContext>
  );
};

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  droppableId: string;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  tasks,
  droppableId,
}) => (
  <div className="flex-1 min-w-[26rem] max-w-[26rem]">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="bg-gray-800 p-4 rounded-lg min-h-[500px]"
        >
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="mb-4"
                >
                  <TaskCardCompact
                    task={task}
                    members={[]}
                    topTrailingChild={<Grip size={20} color="black" />}
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
);

export default SprintBacklog;
