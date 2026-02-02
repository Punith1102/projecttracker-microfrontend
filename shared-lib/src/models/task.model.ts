import { User } from './auth.models';

export interface Task {
    taskId: number;
    title: string;
    description: string;
    status: { statusId: number, name: string };
    assignedTo?: User;
    createdBy?: User;
    project?: { projectId: number, name: string };
    priority?: string;
    dueDate?: string;
}
