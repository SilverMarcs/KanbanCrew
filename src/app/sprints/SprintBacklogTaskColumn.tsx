import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "@/models/Task";
import { Grip } from "lucide-react";
import { TaskCardCompact } from "@/components/TaskCardCompact";

interface SprintBacklogTaskColumnProps {
  title: string;
  tasks: Task[];
  droppableId: string;
}

const SprintBacklogTaskColumn: React.FC<SprintBacklogTaskColumnProps> = ({
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

export default SprintBacklogTaskColumn;
