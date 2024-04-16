import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Privilege, privilegeSchema } from './entities/privilege.entity';
import { PrivilegeController } from './privilege.controller';
import { PrivilegeRepository } from './permission.repository';
import { PrivilegeService } from './privilege.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Privilege.name,
        schema: privilegeSchema,
      },
    ]),
  ],
  controllers: [PrivilegeController],
  providers: [PrivilegeService, PrivilegeRepository],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
