import * as mailjet from 'node-mailjet';

import { ConfigService } from '@fc/config';

import { MailerConfig } from '../dto';
import { MailOptions, Transport } from '../interfaces';

export class MailjetTransport implements Transport {
  private mailer: any;

  constructor(private readonly config: ConfigService) {
    const { key, secret, options } = this.config.get<MailerConfig>('Mailer');

    this.mailer = mailjet.connect(key, secret, options);
  }

  async send(params: MailOptions): Promise<unknown> {
    return this.mailer.post('send').request(MailjetTransport.mapParams(params));
  }

  /**
   * Map the generic transporter params to the specifics mailjet params
   * @param params
   * @returns the mail params formatted for mailjet API call
   */
  private static mapParams(params: MailOptions): object {
    const { from, subject, body, to } = params;

    const recipients = to.map(({ email: Email, name: Name }) => {
      return { Email, Name };
    });

    return {
      Subject: subject,
      'HTML-part': body,
      FromEmail: from.email,
      FromName: from.name,
      Recipients: recipients,
    };
  }
}
