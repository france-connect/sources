import { Injectable } from '@nestjs/common';

import {
  AccountNotFoundException,
  AccountService,
  IIdpSettings,
} from '@fc/account';
import { PartialExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';

import { AppConfig } from '../dto';
import { CsmrUserPreferencesIdpNotFoundException } from '../exceptions';
import {
  IFormattedIdpList,
  IFormattedIdpSettings,
  IFormattedUserIdpSettingsLists,
  IPivotIdentity,
  ISetIdpSettingsPayload,
} from '../interfaces';

@Injectable()
export class CsmrUserPreferencesService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly account: AccountService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
  ) {}

  private getDefaultIdpSettings(): IIdpSettings {
    return {
      /**
       * By default we want to authorize all future idp,
       * therefore exclude all those who would be present in the list (equivalent to a blacklist)
       * For more examples
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/blob/staging/back/apps/csmr-user-preferences/README.md
       **/
      isExcludeList: true,
      list: [],
    };
  }

  private formatIdpSettings(
    identityProvidersMetadata: IdentityProviderMetadata[],
    settings: Pick<IIdpSettings, 'isExcludeList' | 'list'>,
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

  private createIdpSettings(
    inputIdpList: string[],
    isExcludeList: boolean,
    idpList: string[],
  ): Pick<IIdpSettings, 'isExcludeList' | 'list'> {
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
    identity: IPivotIdentity | PartialExcept<IPivotIdentity, 'sub'>,
  ): Promise<IFormattedIdpSettings> {
    this.logger.debug(`Identity received : ${identity}`);

    const identityHash = this.cryptographyFcp.computeIdentityHash(
      identity as IPivotIdentity,
    );
    const { id, preferences } =
      await this.account.getAccountByIdentityHash(identityHash);

    if (!id) {
      throw new AccountNotFoundException();
    }

    const idpList = await this.getIdentityProviderList();
    const idpSettings =
      preferences?.idpSettings ?? this.getDefaultIdpSettings();

    const formattedIdpSettings = this.formatIdpSettings(idpList, idpSettings);

    return formattedIdpSettings;
  }

  async setIdpSettings(
    identity: IPivotIdentity,
    inputIdpList: string[],
    inputIsExcludeList: boolean,
  ): Promise<ISetIdpSettingsPayload> {
    this.logger.debug(`Identity received : ${identity}`);

    const idpList = await this.getIdentityProviderList();
    const idpUids = idpList.map((idp) => idp.uid);
    const inputIdpAllExistsInDatabase = inputIdpList.every((idpUid) =>
      idpUids.includes(idpUid),
    );

    if (!inputIdpAllExistsInDatabase) {
      throw new CsmrUserPreferencesIdpNotFoundException();
    }

    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);
    const currentSettings = this.createIdpSettings(
      inputIdpList,
      inputIsExcludeList,
      idpUids,
    );

    const { updatedAt, preferences } = await this.account.updatePreferences(
      identityHash,
      currentSettings.list,
      currentSettings.isExcludeList,
    );

    let previousSettings = preferences?.idpSettings;
    if (!previousSettings) {
      previousSettings = this.getDefaultIdpSettings();
    }

    const { formattedIdpSettingsList, formattedPreviousIdpSettingsList } =
      this.getFormattedIdpSettingsLists({
        idpList,
        currentSettings,
        previousSettings,
      });

    const updatedIdpSettingsList = this.updatedIdpSettings(
      formattedIdpSettingsList,
      formattedPreviousIdpSettingsList,
    );

    const hasAllowFutureIdpChanged =
      currentSettings.isExcludeList !== previousSettings.isExcludeList;

    return {
      formattedIdpSettingsList,
      updatedIdpSettingsList,
      hasAllowFutureIdpChanged,
      updatedAt,
    };
  }

  private getFormattedIdpSettingsLists({
    idpList,
    currentSettings,
    previousSettings,
  }: {
    idpList: IdentityProviderMetadata[];
    currentSettings: Pick<IIdpSettings, 'isExcludeList' | 'list'>;
    previousSettings: Pick<IIdpSettings, 'isExcludeList' | 'list'>;
  }): IFormattedUserIdpSettingsLists {
    const formattedIdpSettings = this.formatIdpSettings(
      idpList,
      currentSettings,
    );

    const formattedPreviousIdpSettings = this.formatIdpSettings(
      idpList,
      previousSettings,
    );

    return {
      formattedIdpSettingsList: formattedIdpSettings.idpList,
      formattedPreviousIdpSettingsList: formattedPreviousIdpSettings.idpList,
    };
  }

  private updatedIdpSettings(
    current: IFormattedIdpList[],
    previous: IFormattedIdpList[],
  ): IFormattedIdpList[] {
    const previousMap = {};
    previous.forEach((elem) => (previousMap[elem.uid] = elem.isChecked));
    const result = current.filter(
      ({ uid, isChecked }) => previousMap[uid] !== isChecked,
    );
    return result;
  }

  private async getIdentityProviderList(): Promise<IdentityProviderMetadata[]> {
    const { aidantsConnectUid } = this.config.get<AppConfig>('App');

    const idpList = await this.identityProvider.getList();
    const filteredIdpList = idpList.filter(
      ({ uid }) => uid !== aidantsConnectUid,
    );

    return filteredIdpList;
  }
}
