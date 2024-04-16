
import { TaskStatus } from '../entities/application.entity';

export class TasksStatusDto {
    taskId: string
    submissionNumber?: number
    status: TaskStatus
}
