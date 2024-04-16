import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, roleSchema } from './entities/role.entity';
import { HistoryModule } from '../history/history.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: roleSchema }]),
    HistoryModule
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleRepository, RoleService],
})
export class RoleModule {}
