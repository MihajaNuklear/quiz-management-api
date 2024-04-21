import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { CONFIGURATION_TOKEN_DI } from '../config/configuration-di.constant';
import configuration from '../config/configuration.constant';
import { RoleModule } from '../role/role.module';
import { TokenRequestModule } from '../token-request/token-request.module';
import { User, userSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { PrivilegeModule } from '../privilege/privilege.module';
import { RoleService } from '../role/role.service';
import { GroupModule } from '../group/group.module';
import { MailQueueModule } from '../mail-queue/mail-queue.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    TokenRequestModule,
    forwardRef(() => AuthModule),
    RoleModule,
    PrivilegeModule,
    GroupModule,
    MailQueueModule,
    HistoryModule
  ],

  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RoleService,
    {
      provide: CONFIGURATION_TOKEN_DI,
      useValue: configuration(),
    },
    {
      provide: 'authService',
      useClass: AuthService,
    },
  ],
  exports: [UserService,UserRepository],
})
export class UserModule { }
