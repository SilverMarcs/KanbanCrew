import { Priority } from "./Priority";
import { ProjectStage } from "./ProjectStage";
import { Status } from "./Status";
import { Tag } from "./Tag";
import { Type } from "./Type";

export interface Task {
    index: number;
    title: string;
    storyPoints: number; // Need to ensure it's between 1 and 10 I think
    priority: Priority;
    avatarUrl: string;
    tag: Tag;
    assignee: string;
    description: string;
    projectStage: ProjectStage;
    status: Status;
    type: Type;
}