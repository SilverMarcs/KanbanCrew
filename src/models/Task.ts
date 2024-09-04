import { Priority } from "./Priority";
import { ProjectStage } from "./ProjectStage";
import { Status } from "./Status";
import { Tag } from "./Tag";
import { Type } from "./Type";

export interface Task {
    id: string;
    index: number;
    title: string;
    storyPoints: number;
    priority: Priority;
    avatarUrl: string;
    tags: Tag[];
    assignee: string;
    description: string;
    projectStage: ProjectStage;
    status: Status;
    type: Type;
  }