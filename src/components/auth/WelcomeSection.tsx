export function WelcomeSection() {
  return (
    <div className="hidden w-1/2 bg-muted flex-col justify-center lg:flex">
      <div className="px-8">
        <h1 className="text-4xl font-bold mb-6">Welcome to KanbanCrew</h1>
        <p className="text-lg mb-4">
          Streamline your project management with our intuitive Kanban board
          system.
        </p>
        <p className="text-sm text-muted-foreground font-semibold mt-2">
          Subtitle
        </p>
      </div>
    </div>
  );
}
