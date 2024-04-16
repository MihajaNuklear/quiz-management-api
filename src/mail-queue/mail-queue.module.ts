import { Module } from '@nestjs/common';
import { MailQueueService } from './mail-queue.service';
import { MailQueueController } from './mail-queue.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MailQueue, mailQueueSchema } from './entities/mail-queue.entity';
import { MailQueueRepository } from './mail-queue.repository';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import config from '../config/configuration.constant';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../config/configuration.constant';
import { TokenService } from '../token/token.service';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config().mail.smtpHost,
        port: config().mail.smtpPort,
        auth: {
          user: config().mail.smtpUser,
          pass: config().mail.smtpPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: `Innovation Campus <no-reply@ic.mg>`,
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    MongooseModule.forFeature([
      { name: MailQueue.name, schema: mailQueueSchema },
    ]),
  ],
  controllers: [MailQueueController],
  providers: [MailQueueService, MailQueueRepository, TokenService],
  exports: [MailQueueService, MailQueueRepository],
})
export class MailQueueModule {}
