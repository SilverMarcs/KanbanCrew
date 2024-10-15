import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Task } from "@/models/Task";
import { TaskCardCompact } from "@/components/task/TaskCardCompact";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  <div className="flex-1 min-w-[29rem] max-w-[29rem] rounded-lg p-4 sprint-backlog">
    <h3 className="text-xl font-semibold mb-4 drop-shadow">{title}</h3>

    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div className="flex flex-col">
          <ScrollArea
            className="h-[500px]"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks.length === 0 ? (
              <div className="text-muted-foreground">No tasks available</div>
            ) : (
              tasks.map((task, index) => (
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
                        isEditable={false}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </ScrollArea>
        </div>
      )}
    </Droppable>
  </div>
);

export default SprintBacklogTaskColumn;
