import { Injectable } from '@nestjs/common';

import { AccountNotFoundException, AccountService } from '@fc/account';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { LoggerLevelNames, LoggerService } from '@fc/logger';

import { IIdpSettings } from '../interfaces';

@Injectable()
export class UserPreferencesFcpService {
  constructor(
    private readonly logger: LoggerService,
    private readonly account: AccountService,
    private readonly cryptographyFcp: CryptographyFcpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getIdpSettings(identity: IPivotIdentity): Promise<IIdpSettings> {
    this.logger.debug(`Identity received : ${identity}`);
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);
    const { id, idpSettings } = await this.account.getAccountByIdentityHash(
      identityHash,
    );
    if (!id) {
      this.logger.trace(
        { error: 'No account found', identityHash },
        LoggerLevelNames.WARN,
      );
      throw new AccountNotFoundException();
    }

    this.logger.trace({
      accountId: id,
      identity,
      identityHash,
      idpSettings: idpSettings,
    });

    if (!idpSettings) {
      return {
        updatedAt: null,
        includeList: [],
      };
    }

    return idpSettings;
  }

  async setIdpSettings(
    identity: IPivotIdentity,
    includeList: string[],
  ): Promise<IIdpSettings> {
    this.logger.debug(`Identity received : ${identity}`);
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);

    this.logger.debug(`includeList received : ${includeList}`);
    const { id, idpSettings } = await this.account.updateIdpSettings(
      identityHash,
      includeList,
    );
    if (!id) {
      this.logger.trace(
        { error: 'No account found', identityHash },
        LoggerLevelNames.WARN,
      );

      throw new AccountNotFoundException();
    }

    this.logger.trace({
      accountId: id,
      identity,
      identityHash,
      includeList,
      idpSettings: idpSettings,
    });

    return idpSettings;
  }
}
