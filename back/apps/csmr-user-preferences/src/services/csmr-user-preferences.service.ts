import { Injectable } from '@nestjs/common';

import { AccountNotFoundException, AccountService } from '@fc/account';
import { IPreferences } from '@fc/account/interfaces';
import { PartialExcept } from '@fc/common';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { IdentityProviderMetadata, IOidcIdentity } from '@fc/oidc';

import { CsmrUserPreferencesIdpNotFoundException } from '../exceptions';
import { IIdpSettings } from '../interfaces';

@Injectable()
export class CsmrUserPreferencesService {
  constructor(
    private readonly logger: LoggerService,
    private readonly account: AccountService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  formatUserIdpSettingsList(
    identityProvidersMetadata: IdentityProviderMetadata[],
    preferences: IPreferences = {
      identityProviderList: [],
      isExcludeList: false,
    },
  ): IIdpSettings[] {
    const { identityProviderList, isExcludeList } = preferences;
    return identityProvidersMetadata
      .filter((idp) => idp.display)
      .map(({ uid, name, image, title, active }) => {
        const isPreferencesNotInitialized = !identityProviderList.length;
        const isIdpSelected =
          isExcludeList !== identityProviderList.includes(uid);

        return {
          uid,
          name,
          image,
          title,
          active,
          isChecked: isPreferencesNotInitialized || isIdpSelected,
        } as IIdpSettings;
      });
  }

  createAccountPreferencesIdpList(
    idpList: string[],
    allowFutureIdp: boolean,
    identityProviderUids: string[],
  ): { isExcludeList: boolean; identityProviderList: string[] } {
    const identityProviderList = allowFutureIdp
      ? identityProviderUids.filter((idp) => !idpList.includes(idp))
      : [...idpList];

    return {
      isExcludeList: allowFutureIdp,
      identityProviderList,
    };
  }

  async getIdpSettings(
    identity: IOidcIdentity | PartialExcept<IOidcIdentity, 'sub'>,
  ): Promise<IIdpSettings[]> {
    this.logger.debug(`Identity received : ${identity}`);
    const identityHash = this.cryptographyFcp.computeIdentityHash(
      identity as IPivotIdentity,
    );
    const { id, preferences } = await this.account.getAccountByIdentityHash(
      identityHash,
    );
    if (!id) {
      this.logger.trace(
        { error: 'No account found', identityHash },
        LoggerLevelNames.WARN,
      );
      throw new AccountNotFoundException();
    }

    const idpListMetadata = await this.identityProvider.getList();

    const formattedIdpSettings = this.formatUserIdpSettingsList(
      idpListMetadata,
      preferences,
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
    idpList: string[],
    allowFutureIdp: boolean,
  ): Promise<IIdpSettings[]> {
    this.logger.debug(`Identity received : ${identity}`);

    const idpListMetadata = await this.identityProvider.getList();
    const identityProviderUids = idpListMetadata.map(
      (metadata) => metadata.uid,
    );
    const areIdentityProvidersInMetadata = idpList.every((idpUid) =>
      identityProviderUids.includes(idpUid),
    );
    if (!areIdentityProvidersInMetadata) {
      throw new CsmrUserPreferencesIdpNotFoundException();
    }

    this.logger.debug(
      `idpList received : ${idpList}, allowFutureIdp: ${allowFutureIdp}`,
    );
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);
    const { identityProviderList, isExcludeList } =
      this.createAccountPreferencesIdpList(
        idpList,
        allowFutureIdp,
        identityProviderUids,
      );

    const { id, preferences } = await this.account.updatePreferences(
      identityHash,
      identityProviderList,
      isExcludeList,
    );

    const formattedIdpSettings = this.formatUserIdpSettingsList(
      idpListMetadata,
      preferences,
    );

    this.logger.trace({
      accountId: id,
      identity,
      identityHash,
      idpList,
      allowFutureIdp,
      formattedIdpSettings,
      preferences,
    });

    return formattedIdpSettings;
  }
}
