import { DateTime } from 'luxon';

import { Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import {
  IdpConfigUpdateEmailParameters,
  MailerConfig,
  MailerNotificationConnectException,
  MailerService,
  MailFrom,
  MailTo,
  NoEmailException,
} from '@fc/mailer';

import { AppConfig } from '../dto';
import { EmailsTemplates } from '../enums';
import { FormatDate } from '../enums/format-date.enum';

@Injectable()
export class UserDashboardService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private formatDateForEmail(isoDate: string): string {
    const { timezone } = this.config.get<AppConfig>('App');

    return DateTime.fromISO(isoDate)
      .setZone(timezone)
      .setLocale('fr')
      .toFormat(FormatDate.LUXON_FORMAT_DATETIME_FULL_FR);
  }

  private async getIdpConfigUpdateEmailBodyContent(
    userInfo,
    idpConfiguration,
  ): Promise<string> {
    const { email } = userInfo;
    const {
      updatedIdpSettingsList,
      hasAllowFutureIdpChanged,
      allowFutureIdp,
      updatedAt,
    } = idpConfiguration;

    const formattedUpdateDate = this.formatDateForEmail(updatedAt);
    const idpConfigUpdateEmail = {
      email,
      updatedIdpSettingsList,
      allowFutureIdp,
      hasAllowFutureIdpChanged,
      formattedUpdateDate,
    };
    this.logger.trace({ idpConfigUpdateEmail });

    const dtoValidationErrors = await validateDto(
      idpConfigUpdateEmail,
      IdpConfigUpdateEmailParameters,
      validationOptions,
    );

    if (dtoValidationErrors.length > 0) {
      this.logger.error(dtoValidationErrors);
      throw new MailerNotificationConnectException();
    }

    const fileName = EmailsTemplates.IDP_CONFIG_UPDATES_EMAIL;
    const htmlContent = this.mailer.mailToSend(fileName, idpConfigUpdateEmail);

    return htmlContent;
  }

  async sendMail(userInfo, idpConfiguration): Promise<void> {
    const { from } = this.config.get<MailerConfig>('Mailer');
    let errors = await validateDto(from, MailFrom, validationOptions);
    if (errors.length > 0) {
      this.logger.error(errors);
      throw new NoEmailException();
    }

    const { email, givenName, familyName } = userInfo;

    const mailTo: MailTo = {
      email,
      name: `${givenName} ${familyName}`,
    };

    const to: MailTo[] = [mailTo];
    errors = await validateDto(mailTo, MailTo, validationOptions);
    if (errors.length > 0) {
      this.logger.error(errors);
      throw new NoEmailException();
    }

    // -- email bodyfamilyName
    const body = await this.getIdpConfigUpdateEmailBodyContent(
      userInfo,
      idpConfiguration,
    );

    this.logger.trace({ from, to });

    this.mailer.send({
      from,
      to,
      subject: `Modification de vos accès dans FranceConnect`,
      body,
    });
  }
}
