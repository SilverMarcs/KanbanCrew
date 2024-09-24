import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/models/Task";
import { Sprint } from "@/models/sprints/Sprint";
import { Status } from "@/models/Status";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import SprintBacklogTaskColumn from "./SprintBacklogTaskColumn";

interface SprintBacklogProps {
  sprint: Sprint;
}

const SprintBacklog: React.FC<SprintBacklogProps> = ({ sprint }) => {
  const allTasks = useTasks();
  const [productBacklogTasks, setProductBacklogTasks] = useState<Task[]>([]);
  const [sprintBacklogTasks, setSprintBacklogTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Dont show completed tasks or tasks already in a sprint in the product backlog
    setProductBacklogTasks(
      allTasks.filter(
        (task) => !task.sprintId && task.status !== Status.Completed
      )
    );
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
        <SprintBacklogTaskColumn
          title="Product Backlog"
          tasks={productBacklogTasks}
          droppableId="ProductBacklog"
        />
        <SprintBacklogTaskColumn
          title="Sprint Backlog"
          tasks={sprintBacklogTasks}
          droppableId="SprintBacklog"
        />
      </div>
    </DragDropContext>
  );
};

export default SprintBacklog;
