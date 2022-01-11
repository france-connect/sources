import { SentMessageInfo } from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

import { LoggerService } from '@fc/logger';

import { MailOptions, Transport } from '../interfaces';

@Injectable()
export class SmtpService implements Transport {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async send(params: MailOptions): Promise<SentMessageInfo> {
    this.logger.debug('SmtpService.send()');
    const {
      subject,
      body,
      to,
      from: { name, email },
    } = params;

    this.logger.trace({ params });

    const emailInfo = await this.mailerService.sendMail({
      from: { address: email, name } as Address,
      to: to.map(({ email, name }) => ({
        address: email,
        name,
      })) as Address[],
      subject,
      html: body,
    });

    this.logger.trace({ emailInfo });

    return emailInfo;
  }
}
