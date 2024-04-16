import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Commentary, commentSchema } from './entities/comment.entity';
import { CommentRepository } from './comment.repository';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Commentary.name, schema: commentSchema }]),
    HistoryModule
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule { }
