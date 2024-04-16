
import { TaskStatus } from '../entities/application.entity';

export class TasksDetailsDto {
    name: string
    submissionNumber: number
    status: TaskStatus
}
