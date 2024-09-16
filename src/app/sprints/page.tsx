"use client";
import { useTasks } from "@/hooks/useTasks";
import KanbanBoard from "@/app/sprints/KanbanBoard";
import SprintList from "./SprintList";

export default function SprintsPage() {
  const tasks = useTasks();

  return (
    <div className="p-16 text-white">
      <h1 className="text-4xl font-bold mb-8">Sprints</h1>
      {/* these should not be called here. but placing for now for viewing */}
      <SprintList />
      <KanbanBoard tasks={tasks} />
    </div>
  );
}
