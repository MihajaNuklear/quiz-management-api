import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, groupSchema } from './entities/group.entity';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: groupSchema }]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  exports: [GroupRepository, GroupService],
})
export class GroupModule {}
