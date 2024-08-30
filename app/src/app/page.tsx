"use client"
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig"; // Adjust the path if necessary
import { TaskCard, type TaskCardProps } from "@/components/TaskCard";
import { CreateTaskCard } from "@/components/CreateTaskCard";

export default function Home() {
	const [tasks, setTasks] = useState<TaskCardProps[]>([]);

	useEffect(() => {
		const fetchTasks = async () => {
			const querySnapshot = await getDocs(collection(db, "tasks")); // Replace "tasks" with your actual collection name
			const tasksData: TaskCardProps[] = [];
			// biome-ignore lint/complexity/noForEach: <explanation>
			querySnapshot.forEach((doc) => {
				tasksData.push({
					index: doc.data().index,
					title: doc.data().title,
					storyPoints: doc.data().storyPoints,
					priority: doc.data().priority,
					avatarUrl: doc.data().avatarUrl,
					tag: doc.data().tag,
				});
			});
      console.log(tasksData);
			setTasks(tasksData);
		};

		fetchTasks();
	}, []);

	return (
		<div className="p-16">
			<h1 className="text-5xl font-bold">Product Backlog</h1>
			<div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
				{tasks.map((task, index) => (
					<TaskCard
						key={index}
						index={index}
						title={task.title}
						storyPoints={task.storyPoints}
						priority={task.priority}
						avatarUrl={task.avatarUrl}
						tag={task.tag}
					/>
				))}
				<CreateTaskCard />
			</div>
		</div>
	);
}
