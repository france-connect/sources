import * as _ from 'lodash';
import { Attachment } from 'nodemailer/lib/mailer';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { generateCSVContent } from '@fc/csv';
import { MailerService, MailFrom, MailTo } from '@fc/mailer';

import { AppRmqConfig } from '../dto';
import { EmailsTemplates } from '../enums';
import {
  SecurityTicketDataInterface,
  TracksTicketDataInterface,
} from '../interfaces';
import { getTracksByIdpName, getTracksBySpName } from '../utils';

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

    const attachments = this.getMailAttachments(ticketData.tracks);

    await this.sendFraudMail(from, body, attachments);
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

  private getMailAttachments(
    tracks: TracksTicketDataInterface[],
  ): Attachment[] {
    if (!tracks || tracks.length === 0) {
      return [];
    }

    const tracksBySpName = getTracksBySpName(tracks);
    const tracksByIdpName = getTracksByIdpName(tracks);

    const spAttachments = Object.entries(tracksBySpName).map(
      ([spName, spTracks]) => ({
        filename: `${spName}_connexions.csv`,
        content: generateCSVContent(spTracks),
        contentType: 'text/csv',
      }),
    );

    const idpAttachments = Object.entries(tracksByIdpName).map(
      ([idpName, idpTracks]) => ({
        filename: `${idpName}_connexions.csv`,
        content: generateCSVContent(idpTracks),
        contentType: 'text/csv',
      }),
    );

    return [...spAttachments, ...idpAttachments];
  }

  private async sendFraudMail(
    from: MailFrom,
    body: string,
    attachments: Attachment[],
  ): Promise<void> {
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
      attachments,
    });
  }
}
