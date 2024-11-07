import * as _ from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { MailerService, MailFrom, MailTo } from '@fc/mailer';

import { AppRmqConfig } from '../dto';
import { EmailsTemplates } from '../enums';
import { SecurityTicketDataInterface } from '../interfaces';

@Injectable()
export class CsmrFraudSupportService {
  constructor(
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {}

  async createSecurityTicket(
    ticketData: SecurityTicketDataInterface,
  ): Promise<void> {
    const { givenName, familyName, contactEmail } = ticketData;

    const from = this.getMailFrom(givenName, familyName, contactEmail);

    const body = await this.getMailBodyContent(ticketData);

    await this.sendFraudMail(from, body);
  }

  private getMailFrom(
    givenName: string,
    familyName: string,
    contactEmail: string,
  ): MailFrom {
    const userFullName = [givenName, familyName].join(' ').trim();

    return {
      email: contactEmail,
      name: userFullName,
    };
  }

  private async getMailBodyContent(
    ticketData: SecurityTicketDataInterface,
  ): Promise<string> {
    const templateFile = EmailsTemplates.FRAUD_FORM_EMAIL;
    return await this.mailer.mailToSend(templateFile, ticketData);
  }

  private async sendFraudMail(from: MailFrom, body: string): Promise<void> {
    const { fraudEmailAddress, fraudEmailRecipient, fraudEmailSubject } =
      this.config.get<AppRmqConfig>('App');

    const mailTo: MailTo = {
      email: fraudEmailAddress,
      name: fraudEmailRecipient,
    };

    const to: MailTo[] = [mailTo];

    await this.mailer.send({
      from,
      to,
      subject: fraudEmailSubject,
      body,
      replyTo: from,
    });
  }
}
