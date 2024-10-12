import { Layers } from "lucide-react";

export function WelcomeSection() {
  return (
    <div className="w-1/2 bg-background flex-col justify-between flex p-8">
      <div className="flex items-center space-x-2">
        <Layers className="h-6 w-6" />
        <span className="font-bold text-xl">KanbanCrew Inc</span>
      </div>
      <div className="space-y-6">
        <h1 className="text-7xl font-bold">Welcome</h1>
        <p className="text-lg">
          Streamline your project management with our intuitive Kanban board
          system.
        </p>
      </div>
      <div className="space-y-2">
        {/* <p className="text-sm text-muted-foreground">
          "This library has saved me countless hours of work and helped me
          deliver stunning designs to my clients faster than ever before."
        </p> */}
        <p className="text-sm font-semibold text-muted-foreground">
          Be productive. Be efficient. Be agile.
        </p>
      </div>
    </div>
  );
}
