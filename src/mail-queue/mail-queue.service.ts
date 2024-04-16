import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { MailQueueRepository } from './mail-queue.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/sendmail.dto';
import { MailQueueStatus } from './entities/mail-queue.entity';
import * as path from 'path';
import * as fs from 'fs';
import handlebars from 'handlebars';
import { ContactUs } from './dto/contact.interface';
import config from '../config/configuration.constant';
import { ICON_SUMMARY_DIRECTORY } from './contact.constant';
import { ConfirmationForm, ResetPasswordForm } from './dto/confirmation.form';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';

@Injectable()
export class MailQueueService {
  constructor(
    private readonly mailRepository: MailQueueRepository,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Service send email
   * @param mailOptionDto
   * @returns
   */
  async sendMail(mailOptionDto: SendMailDto) {
    return await this.mailerService.sendMail(mailOptionDto);
  }

  async sendContactMail(body: ContactUs): Promise<boolean> {
    const templateFile = fs.readFileSync(
      path.join(__dirname, 'templates', 'contact.hbs'),
      'utf8',
    );
    const template = handlebars.compile(templateFile);
    const { mail, phone, company, message } = body;
    const emailContent = template(
      {
        mail,
        phone,
        company,
        message,
      },
      {
        allowProtoMethodsByDefault: true,
        allowCallsToHelperMissing: true,
      },
    );
    try {
      await this.mailerService.sendMail({
        from: config().mail.smtpUser,
        to: mail,
        subject: `Demande d'information`,
        template: './contact',
        html: emailContent,
      });
      return true;
    } catch (error) {
      console.error(`Error sending email : ${error}`);
    }
  }

  async sendRegistrationConfirmation(confirmationForm: ConfirmationForm) {
    const id = confirmationForm.id;
    const fullname = `${confirmationForm.lastname} ${confirmationForm.firstname}`;
    const firstname = confirmationForm.firstname;
    const lastname = confirmationForm.lastname;
    const username = confirmationForm.username;
    const email = confirmationForm.email;
    const gender = confirmationForm.gender === 'MALE' ? 'Cher' : 'Chère';
    const redirige =
      confirmationForm.gender === 'MALE' ? 'redirigé' : 'redirigée';
    const token = this.tokenService.generateToken({
      id: id,
      username: username,
      email: email,
    });
    const link = `${config().front.validationUrl}/validation`;

    const linkToSummary = `${config().front.validationUrl}/validation/${token}`;

    const title = 'Confirmation de votre inscription';
    const year = '2024';
    const startDate = '01 Janvier 2024';
    const endDate = '30 Janvier 2024';

    const templateFilePath = path.resolve(
      'src',
      'mail-queue',
      'templates',
      'confirmation.hbs',
    );

    const templateFile = fs.readFileSync(templateFilePath, 'utf8');

    const template = handlebars.compile(templateFile);

    const emailContent = template(
      {
        title,
        year,
        fullname,
        firstname,
        lastname,
        linkToSummary,
        startDate,
        endDate,
        gender,
        redirige,
        link,
      },
      {
        allowProtoMethodsByDefault: true,
        allowCallsToHelperMissing: true,
      },
    );
    try {
      await this.mailerService.sendMail({
        from: config().mail.smtpUser,
        to: confirmationForm.email,
        subject: title,
        template: './confirmation',
        html: emailContent,
      });
    } catch (e) {
      console.error(`Error sending email : ${e}`);
    }
  }

  async sendResetPasswordToken(resetForm: ResetPasswordForm) {
    const email = resetForm.email;
    const token = resetForm.token;
    const linkToSummary = `${
      config().front.validationUrl
    }/password-reset/${token}`;

    const title = 'Réinitialisation du mot de passe du compte IC';

    const templateFilePath = path.resolve(
      'src',
      'mail-queue',
      'templates',
      'reset-password.hbs',
    );

    const templateFile = fs.readFileSync(templateFilePath, 'utf8');

    const template = handlebars.compile(templateFile);

    const emailContent = template(
      {
        title,
        linkToSummary,
      },
      {
        allowProtoMethodsByDefault: true,
        allowCallsToHelperMissing: true,
      },
    );
    try {
      await this.mailerService.sendMail({
        from: config().mail.smtpUser,
        to: email,
        subject: title,
        template: './reset-password',
        html: emailContent,
      });
    } catch (e) {
      console.error(`Error sending email : ${e}`);
    }
  }

  /**
   *
   * @param createMailDto
   * @returns
   */
  async create(createMailDto) {
    return await this.mailRepository.create(createMailDto);
  }

  /**
   *
   * @returns
   */
  async findAll() {
    return await this.mailRepository.find({});
  }

  async findMailStatus(id: string) {
    const mail = await this.mailRepository.findById(id);

    if (!mail) {
      return;
    }
    console.log(mail);

    return mail;
  }

  /**
   *
   * @param id
   * @returns
   */
  async findOne(id: string) {
    return await this.mailRepository.findById(id);
  }

  /**
   *
   * @param id
   * @param updateMailDto
   * @returns
   */
  async update(id: string, updateMailDto: UpdateMailDto) {
    return await this.mailRepository.update(id, updateMailDto);
  }

  /**
   * Change Status of Mail to SENT
   * @param id
   * @param updateMailDto
   * @returns
   */
  async markMailAsSent(id: string, status: MailQueueStatus) {
    const updateMailDto = { status: status };
    return await this.mailRepository.update(id, updateMailDto);
  }

  /**
   * iincrement attempt count
   * @param id
   * @returns
   */
  async incrementAttempCount(id: string) {
    const mail = this.findOne(id);
    let attemptCount = (await mail).sendAttemptCount;
    const updateMailDto = { sendAttemptCount: attemptCount++ };
    return await this.mailRepository.update(id, updateMailDto);
  }
  /**
   *
   * @param id
   * @returns
   */
  async remove(id: string) {
    return await this.mailRepository.delete(id);
  }
}
