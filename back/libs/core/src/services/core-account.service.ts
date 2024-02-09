import { Injectable } from '@nestjs/common';

import { Account, AccountBlockedException, AccountService } from '@fc/account';
import { LoggerService } from '@fc/logger';

import {
  CoreFailedPersistenceException,
  CoreIdpBlockedForAccountException,
} from '../exceptions';
import { ComputeSp } from '../types';

@Injectable()
export class CoreAccountService {
  constructor(
    protected readonly logger: LoggerService,
    private readonly account: AccountService,
  ) {}

  /**
   * Check if an account exists and is blocked
   * @param identity
   */
  async checkIfAccountIsBlocked(identityHash: string): Promise<void> {
    const accountIsBlocked = await this.account.isBlocked(identityHash);

    if (accountIsBlocked) {
      throw new AccountBlockedException();
    }
  }

  /**
   * Computes federation entry for a given identity and provider id
   *
   * @param {string} key - id of the Service Provider (spId - FCA) or entityId (FCP)
   * @param {string} sub - sub of the Service Provider
   */

  private buildFederation(key: string, sub: string) {
    return { [key]: sub };
  }

  /**
   * Build and persist current interaction with account service
   * @param {string} key - id of the Service Provider (spId - FCA) or entityId (FCP)
   * @param {string} sub - sub of the Service Provider
   * @param {string} identityHash - hash of the Service Provider
   */
  async computeFederation({
    key,
    identityHash,
    sub,
  }: ComputeSp): Promise<string> {
    const spFederation = this.buildFederation(key, sub);

    const interaction = {
      // service provider Hash is used as main identity hash
      identityHash,
      // Set last connection time to now
      lastConnection: new Date(),
      spFederation,
    };

    try {
      const accountId = await this.account.storeInteraction(interaction);

      return accountId;
    } catch (error) {
      this.logger.alert(
        `Failed to store interaction for ${identityHash.replace(
          /^(.{3}).*(.{3})$/,
          '$1*****$2',
        )}`,
      );
      throw new CoreFailedPersistenceException(error);
    }
  }

  /**
   * Check if the current IdP is blocked for the current account.
   * @param {Account} account The current account
   * @param {String} idpId The current idpId
   */

  checkIfIdpIsBlockedForAccount(account: Account, idpId: string): void {
    if (!account.preferences) {
      return;
    }

    const { isExcludeList, list } = account.preferences.idpSettings;
    if (isExcludeList === list.includes(idpId)) {
      throw new CoreIdpBlockedForAccountException();
    }
  }
}
