import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { GroupService } from './group/group.service';
import { PrivilegeService } from './privilege/privilege.service';
import { RoleService } from './role/role.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailQueueService } from './mail-queue/mail-queue.service';
import { MailQueue, MailQueueStatus } from './mail-queue/entities/mail-queue.entity';
import { ConfirmationForm, ResetPasswordForm } from './mail-queue/dto/confirmation.form';
import { RegistrationPeriodService } from './registration-period/registration-period.service';

/**
 * Every 10 seconds interval
 */
const EVERY_10_SECONDS_INTERVAL = 10000;

/**
 * Every hour interval
 */
const EVERY_HOUR_INTERVAL = 1000 * 60 * 1;

/**
 * Service for App
 */
@Injectable()
export class AppService {
    /**
     * Constructor for AppService
     * @param mailNotificationService Injected MailNotificationService
     */
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly groupService: GroupService,
        private readonly privilegeService: PrivilegeService,
        private readonly mailQueueService: MailQueueService,
        private readonly registrationPeriodService: RegistrationPeriodService,
    ) {
        /**
         * Schedule sending pending emails
         * setInterval is used here instead of cron based @nestjs/schedule because of cron package vulnerability
         */
    }

    /**
     * Interval ref for pending mail
     */
    intervalRef;

    /**
     * Hourly interval ref
     */
    hourlyIntervalRef;

    /**
     * Determines whether pending mail is running
     */
    private isPendingMailRunning = false;

    /**
     * Determines whether inactivity check is running
     */
    private isInactivityCheckRunning = false;

    /**
     * Send pending mails
     */
    async sendPendingMail() {
        if (!this.isPendingMailRunning) {
            try {
                this.isPendingMailRunning = true;
            } catch (error) {
                Logger.error(error);
            } finally {
                this.isPendingMailRunning = false;
            }
        }
    }

    /**
     * Clear pending intervals
     */
    async clearPendingIntervals() {
        clearInterval(this.intervalRef);
        clearInterval(this.hourlyIntervalRef);
    }



    @Cron(CronExpression.EVERY_30_SECONDS)
    async sendMailOneByOne() {
        const mail = await this.mailQueueService.findAll();

        if (!mail) {
            console.log('Empty Mail Queue...');
            return;
        }

        console.log('Mail Sending attempt at:', new Date());

        const mailNotSent = mail.filter((mail) => mail.status === 'NOT_SENT');

        if (mailNotSent.length === 0) {
            console.log('No mails to send...');
            return;
        }

        for (const mailItem of mailNotSent) {
            try {
                if (mailItem.subject === 'CONFIRMATION') {
                    await this.sendConfirmationMail(mailItem);
                } else if (mailItem.subject === 'RESET') {
                    await this.sendResetPasswordMail(mailItem);
                }
            } catch (error) {
                await this.mailQueueService.incrementAttempCount(mailItem._id);
                console.error(`Error sending mail: ${error}`);
            }

            // Wait for 30 seconds before sending the next mail
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }

    async sendConfirmationMail(mail: MailQueue) {
        const userMail = mail.to;
        const user = await this.userService.findUserByEmail(userMail);
        const userId = user._id.toString();
        const userFirstname = user.firstname;
        const userLastname = user.lastname;
        const username = user.username;
        const gender = user.gender;

        const mailConfirmOptionDto: ConfirmationForm = {
            id: userId,
            email: userMail,
            firstname: userFirstname,
            lastname: userLastname,
            username: username,
            gender: gender,
        };

        if (mail.sendAttemptCount > 5) {
            await this.mailQueueService.markMailAsSent(mail._id, MailQueueStatus.ARCHIVED);
        } else {
            await this.mailQueueService.sendRegistrationConfirmation(mailConfirmOptionDto);
            await this.mailQueueService.markMailAsSent(mail._id, MailQueueStatus.SENT);
        }
    }

    async sendResetPasswordMail(mail: MailQueue) {
        const userMail = mail.to;
        const mailToken = mail.html;

        const mailConfirmOptionDto: ResetPasswordForm = {
            token: mailToken,
            email: userMail,
        };

        if (mail.sendAttemptCount > 5) {
            await this.mailQueueService.markMailAsSent(mail._id, MailQueueStatus.ARCHIVED);
        } else {
            await this.mailQueueService.sendResetPasswordToken(mailConfirmOptionDto);
            await this.mailQueueService.markMailAsSent(mail._id, MailQueueStatus.SENT);
        }
    }


    @Cron(CronExpression.EVERY_12_HOURS)
    async cleanMailSentQueue() {
        console.log('Mail Queue clean at:', new Date());
        const mail = await this.mailQueueService.findAll();

        const mailNotSent = mail.filter((mail) => mail.status === 'SENT');

        await Promise.all(
            mailNotSent.map(async (mail) => {
                const mailsId = mail._id;
                try {
                    await this.mailQueueService.remove(mailsId);
                } catch (error) {
                    console.error(`Erreur lors de l'envoi de l'e-mail: ${error.message}`);
                }
            }),
        );

        return 'E-mails queue clean successfully';
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    async updateRegistrationDeadline() {
        const deadlineInfo = await this.registrationPeriodService.findAll();
        const superAdminUser = await this.userService.findByUserName("SUPER_ADMIN_LOGIN")
        const today = new Date(); 
        if(deadlineInfo) {
            deadlineInfo.forEach(async period => {
                const startDate = new Date(period.startDate);
                const endDate = period.endDate;
                const periodId = period._id.toString();
                const history = {
                    action: { name: "UPDATE_REGISTRATION_PERIOD" },
                    user: superAdminUser._id,
                    targetId: periodId,
                    entity: "REGISTRATION_PERIOD",
                  };
                if (startDate <= today && endDate >= today) {
                    await this.registrationPeriodService.update(periodId,{registrationPeriod:{isOpen:true},history});
                }
                else {
                    await this.registrationPeriodService.update(periodId,{registrationPeriod:{isOpen:false},history});
                }
            });
        }
    }   
}
