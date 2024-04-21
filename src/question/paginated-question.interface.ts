import { Paginated } from "../shared/types/page.interface";
import { Question } from "./entities/question.entity";

export interface PaginatedQuestion extends Paginated<Question> {
   questionNames?: string[];
    pageNumber: number;
  }
  