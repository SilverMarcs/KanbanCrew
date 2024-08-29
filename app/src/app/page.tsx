import { TaskCard, TaskCardProps } from "@/components/TaskCard";
import { CreateTaskCard } from "@/components/CreateTaskCard";

// Fake Data
const fakeData: TaskCardProps[] = [
  {
    index: 0,
    title: "Design Landing Page",
    storyPoints: 8,
    priority: "Urgent",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    tag: "UI/UX",
  },
  {
    index: 1,
    title: "Setup Authentication",
    storyPoints: 5,
    priority: "Important",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    tag: "Backend",
  },
  {
    index: 2,
    title: "Database Schema Design",
    storyPoints: 13,
    priority: "Important",
    avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    tag: "Database",
  },
  {
    index: 3,
    title: "Write Unit Tests",
    storyPoints: 3,
    priority: "Low",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    tag: "Testing",
  },
];

export default function Home() {
  return (
    <div className="p-16">
      <h1 className="text-5xl font-bold">Product Backlog</h1>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        {
          // Fake cards for now
          fakeData.map((task, index) => (
            <TaskCard
              key={index}
              index={index}
              title={task.title}
              storyPoints={task.storyPoints}
              priority={task.priority}
              avatarUrl={task.avatarUrl}
              tag={task.tag}
            />
          ))
        }
        <CreateTaskCard />
      </div>
    </div>
  );
}
