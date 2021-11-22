import { Injectable } from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { FeatureHandler, IFeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import {
  ConnectNotificationEmailParameters,
  MailerConfig,
  MailerNotificationConnectException,
  MailerService,
  MailFrom,
  MailTo,
  NoEmailException,
} from '@fc/mailer';
import { OidcSession } from '@fc/oidc';

import { EmailsTemplates } from '../../enums';

@Injectable()
@FeatureHandler('core-fcp-send-email')
export class CoreFcpSendEmailHandler
  implements IFeatureHandler<void, OidcSession>
{
  private configMailer;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.configMailer = this.config.get<MailerConfig>('Mailer');
  }

  getTodayFormattedDate(datejs: Date): string {
    const timeZone = 'Europe/Paris';
    // use `[]` instead of `fr-FR` to use the default local
    const locateDate = datejs.toLocaleString([], { timeZone });
    const date = new Date(locateDate);

    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    const formattedDate = `Le ${day}/${month}/${year} à ${hours}:${minutes}`;
    return formattedDate;
  }

  private async getConnectNotificationEmailBodyContent(
    session: OidcSession,
  ): Promise<string> {
    const { fqdn } = this.config.get<AppConfig>('App');
    const { idpId, spIdentity, spName } = session;
    const { title: idpTitle } = await this.identityProvider.getById(idpId);
    const today = this.getTodayFormattedDate(new Date());
    const connectNotificationEmailParameters = {
      familyName: spIdentity.family_name,
      givenName: spIdentity.given_name,
      idpTitle,
      spName,
      today,
      fqdn,
    };

    const dtoValidationErrors = await validateDto(
      connectNotificationEmailParameters,
      ConnectNotificationEmailParameters,
      validationOptions,
    );
    if (dtoValidationErrors.length > 0) {
      throw new MailerNotificationConnectException();
    }

    const fileName = EmailsTemplates.NOTIFICATION_EMAIL;
    const htmlContent = this.mailer.mailToSend(
      fileName,
      connectNotificationEmailParameters,
    );

    return htmlContent;
  }

  /**
   * The arguments sent to all FeatureHandler's handle() methods must be
   * typed by a interface exteded from `IFeatureHandler`
   * @see IVerifyFeatureHandlerHandleArgument as an exemple.
   * @todo #FC-487
   * @author Hugues
   * @date 2021-16-04
   */
  /**
   * Send an email to the authenticated end-user after consent.
   * If a user haven't provided a valid email, an error is thrown.
   * This validation is done here because only FCP is concerned by the validation.
   *
   * @param {OidcSession} session session content.
   * @returns {Promise<void>}
   */
  async handle(session: OidcSession): Promise<void> {
    // -- email from
    const { from } = this.configMailer;
    let errors = await validateDto(from, MailFrom, validationOptions);
    if (errors.length > 0) {
      throw new NoEmailException();
    }

    // -- email to
    const { spName, spIdentity } = session;
    const {
      email,
      given_name: givenName,
      family_name: familyName,
    } = spIdentity;
    const mailTo: MailTo = {
      email,
      name: `${givenName} ${familyName}`,
    };
    const to: MailTo[] = [mailTo];
    errors = await validateDto(mailTo, MailTo, validationOptions);
    if (errors.length > 0) {
      throw new NoEmailException();
    }

    // -- email body
    const body = await this.getConnectNotificationEmailBodyContent(session);

    this.logger.trace({ from, to });

    // -- send
    this.mailer.send({
      from,
      to,
      subject: `Notification de connexion au service "${spName}" grâce à FranceConnect+`,
      body,
    });
  }
}
