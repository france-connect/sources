import { Injectable } from '@nestjs/common';

import {
  AccountNotFoundException,
  AccountService,
  IIdpSettings,
} from '@fc/account';
import { PartialExcept, validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import {
  IdpConfigUpdateEmailParameters,
  MailerConfig,
  MailerNotificationConnectException,
  MailerService,
  MailFrom,
  MailTo,
  NoEmailException,
} from '@fc/mailer';
import { IdentityProviderMetadata, IOidcIdentity } from '@fc/oidc';

import { EmailsTemplates } from '../enums';
import { CsmrUserPreferencesIdpNotFoundException } from '../exceptions';
import {
  IFormattedIdpList,
  IFormattedIdpSettings,
  IFormattedUserIdpSettingsLists,
  ISetIdpSettingsService,
} from '../interfaces';

@Injectable()
export class CsmrUserPreferencesService {
  private configMailer;

  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly account: AccountService,
    private readonly config: ConfigService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly mailer: MailerService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.configMailer = this.config.get<MailerConfig>('Mailer');
  }

  formatUserIdpSettingsList(
    identityProvidersMetadata: IdentityProviderMetadata[],
    settings: IIdpSettings = {
      isExcludeList: false,
      list: [],
    },
  ): IFormattedIdpSettings {
    const { list, isExcludeList } = settings;

    const formattedList = identityProvidersMetadata
      .filter((idp) => idp.display)
      .map(({ uid, name, image, title, active }) => {
        const isPreferencesNotInitialized = !list.length;
        const isIdpSelected = isExcludeList !== list.includes(uid);

        return {
          uid,
          /**
           * @NOTE The "name" field came from the legacy and should
           * be used only for BDD purposes. It is a user input.
           */
          name,
          image,
          title,
          active,
          isChecked: isPreferencesNotInitialized || isIdpSelected,
        };
      });

    return {
      allowFutureIdp: isExcludeList,
      idpList: formattedList,
    };
  }

  createAccountPreferencesIdpSettings(
    inputIdpList: string[],
    isExcludeList: boolean,
    idpList: string[],
  ): IIdpSettings {
    let list = [...inputIdpList];

    if (isExcludeList) {
      list = idpList.filter((idp) => !list.includes(idp));
    }

    return {
      isExcludeList,
      list,
    };
  }

  async getIdpSettings(
    identity: IOidcIdentity | PartialExcept<IOidcIdentity, 'sub'>,
  ): Promise<IFormattedIdpSettings> {
    this.logger.debug(`Identity received : ${identity}`);

    const identityHash = this.cryptographyFcp.computeIdentityHash(
      identity as IPivotIdentity,
    );
    const { id, preferences = {} } =
      await this.account.getAccountByIdentityHash(identityHash);

    if (!id) {
      this.logger.trace(
        { error: 'No account found', identityHash },
        LoggerLevelNames.WARN,
      );
      throw new AccountNotFoundException();
    }

    const idpList = await this.identityProvider.getList();

    const formattedIdpSettings = this.formatUserIdpSettingsList(
      idpList,
      preferences.idpSettings,
    );

    this.logger.trace({
      accountId: id,
      preferences,
      identity,
      identityHash,
      formattedIdpSettings,
    });

    return formattedIdpSettings;
  }

  async setIdpSettings(
    identity: IPivotIdentity,
    inputIdpList: string[],
    inputIsExcludeList: boolean,
  ): Promise<ISetIdpSettingsService> {
    this.logger.debug(`Identity received : ${identity}`);

    const idpList = await this.identityProvider.getList();
    const idpUids = idpList.map((idp) => idp.uid);
    const inputIdpAllExistsInDatabase = inputIdpList.every((idpUid) =>
      idpUids.includes(idpUid),
    );

    if (!inputIdpAllExistsInDatabase) {
      throw new CsmrUserPreferencesIdpNotFoundException();
    }

    this.logger.debug(
      `inputIdpList received : ${inputIdpList}, inputIsExcludeList: ${inputIsExcludeList}`,
    );
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);
    const { list, isExcludeList } = this.createAccountPreferencesIdpSettings(
      inputIdpList,
      inputIsExcludeList,
      idpUids,
    );

    const { id, preferences: IdpSettingsBeforeUpdate } =
      await this.account.updatePreferences(identityHash, list, isExcludeList);

    const idpListBeforeUpdate = IdpSettingsBeforeUpdate
      ? IdpSettingsBeforeUpdate.idpSettings.list
      : [];
    const isExcludeListBeforeUpdate = IdpSettingsBeforeUpdate
      ? IdpSettingsBeforeUpdate.idpSettings.isExcludeList
      : false;
    const { formattedIdpSettingsList, formattedPreviousIdpSettingsList } =
      this.getFormattedUserIdpSettingsLists({
        idpList,
        newPreferences: {
          list,
          isExcludeList,
        },
        preferencesBeforeUpdate: {
          list: idpListBeforeUpdate,
          isExcludeList: isExcludeListBeforeUpdate,
        },
      });

    const updatedIdpSettingsList = this.updatedIdpSettings(
      formattedIdpSettingsList,
      formattedPreviousIdpSettingsList,
    );

    const hasChangedIsExcludeList = isExcludeList !== isExcludeListBeforeUpdate;

    this.logger.trace({
      accountId: id,
      identity,
      identityHash,
      inputIdpList,
      inputIsExcludeList,
      formattedIdpSettingsList,
      updatedIdpSettingsList,
    });

    return {
      formattedIdpSettingsList,
      updatedIdpSettingsList,
      hasChangedIsExcludeList,
    };
  }

  async sendMail(userInfo, idpConfiguration): Promise<void> {
    const { from } = this.configMailer;
    let errors = await validateDto(from, MailFrom, validationOptions);
    if (errors.length > 0) {
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
      subject: `Notification de mise à jour de votre configuration FI FC+`,
      body,
    });
  }

  private async getIdpConfigUpdateEmailBodyContent(
    userInfo,
    idpConfiguration,
  ): Promise<string> {
    const { email, givenName, familyName } = userInfo;
    const {
      formattedIdpSettingsList,
      updatedIdpSettingsList,
      hasChangedIsExcludeList,
      allowFutureIdp,
    } = idpConfiguration;

    const futureIdpChoice = hasChangedIsExcludeList
      ? !allowFutureIdp
      : allowFutureIdp;
    const idpConfigUpdateEmailParameters = {
      email,
      givenName,
      familyName,
      formattedIdpSettingsList,
      updatedIdpSettingsList,
      futureIdpChoice,
      hasChangedIsExcludeList,
    };

    const dtoValidationErrors = await validateDto(
      idpConfigUpdateEmailParameters,
      IdpConfigUpdateEmailParameters,
      validationOptions,
    );

    if (dtoValidationErrors.length > 0) {
      throw new MailerNotificationConnectException();
    }

    const fileName = EmailsTemplates.IDP_CONFIG_UPDATES_EMAIL;
    const htmlContent = this.mailer.mailToSend(
      fileName,
      idpConfigUpdateEmailParameters,
    );

    return htmlContent;
  }

  private getFormattedUserIdpSettingsLists({
    idpList,
    newPreferences,
    preferencesBeforeUpdate,
  }): IFormattedUserIdpSettingsLists {
    const formattedIdpSettings = this.formatUserIdpSettingsList(
      idpList,
      newPreferences,
    );

    const formattedPreviousIdpSettings = this.formatUserIdpSettingsList(
      idpList,
      preferencesBeforeUpdate,
    );

    return {
      formattedIdpSettingsList: formattedIdpSettings.idpList,
      formattedPreviousIdpSettingsList: formattedPreviousIdpSettings.idpList,
    };
  }

  private updatedIdpSettings(current, previous): IFormattedIdpList[] {
    const previousMap = {};
    previous.forEach((elem) => (previousMap[elem.uid] = elem.isChecked));
    const result = current.filter(
      ({ uid, isChecked }) => previousMap[uid] !== isChecked,
    );
    return result;
  }
}
