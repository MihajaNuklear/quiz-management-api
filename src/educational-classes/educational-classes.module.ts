import { Module } from '@nestjs/common';
import { EducationalClassesService } from './educational-classes.service';
import { EducationalClassesController } from './educational-classes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EducationalClasses,
  educationalclassesSchema,
} from './entities/educational-classes.entity';
import { EducationalClassesRepository } from './educational-classes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EducationalClasses.name, schema: educationalclassesSchema },
    ]),
  ],
  controllers: [EducationalClassesController],
  providers: [EducationalClassesService, EducationalClassesRepository],
  exports: [EducationalClassesRepository, EducationalClassesService],
})
export class EducationalClassesModule {}
