import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MailQueueService } from './mail-queue.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { MailQueue } from './entities/mail-queue.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { MailOptionDto } from './dto/email.option.dto';
import { PasswordResetOptionDto } from './dto/password.reset.option.dto';
import config from '../config/configuration.constant';
import { SendMailDto } from './dto/sendmail.dto';

@Controller('mail-queue')
export class MailQueueController {
  constructor(private readonly mailQueueService: MailQueueService) {}

  @Post('send')
  async sendMailWithTemplate(@Body() body: any): Promise<boolean> {
    return await this.mailQueueService.sendContactMail(body);
  }
  /**
   * Send a link to change password
   * @param email
   * @returns
   */
  @Post('password-reset')
  async sendPasswordEmail(@Body('email') email: string) {
    const from = config().mail.smtpUser;
    console.log('FROM : ' + from);

    const subject = 'PASSWORD VALIDATION FOR INSCRIPTION';
    const text = 'This is the validation mail';
    const mailoption: SendMailDto = { to: email, from, subject, html: text };
    try {
      const result = await this.mailQueueService.sendMail(mailoption);
      return { message: 'E-mail envoyé avec succès', result };
    } catch (error) {
      return {
        error: "Erreur lors de l'envoi de l'e-mail",
        details: error.message,
      };
    }
  }

  @GenericApiOkResponse({
    description: 'Create mail',
    type: MailQueue,
    isArray: false,
  })
  // @RequirePrivilege(PrivilegeName.CREATE_MAIL)
  @Post()
  create(@Body() createMailDto: CreateMailDto) {
    return this.mailQueueService.create(createMailDto);
  }

  @GenericApiOkResponse({
    description: 'Find all mail record',
    type: MailQueue,
    isArray: true,
  })
  // @RequirePrivilege(PrivilegeName.VIEW_MAIL)
  @Get()
  findAll() {
    return this.mailQueueService.findAll();
  }

  @GenericApiOkResponse({
    description: 'Find a mail by Id',
    type: MailQueue,
    isArray: false,
  })
  // @RequirePrivilege(PrivilegeName.VIEW_MAIL)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mailQueueService.findOne(id);
  }

  @GenericApiOkResponse({
    description: 'Update mail',
    type: MailQueue,
    isArray: false,
  })
  // @RequirePrivilege(PrivilegeName.EDIT_MAIL)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailDto: UpdateMailDto) {
    return this.mailQueueService.update(id, updateMailDto);
  }

  @GenericApiOkResponse({
    description: 'Delete mail',
    type: MailQueue,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.DELETE_MAIL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailQueueService.remove(id);
  }
}
