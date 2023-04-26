import { Injectable } from '@nestjs/common';

import { AccountBlockedException, AccountService } from '@fc/account';
import { LoggerService } from '@fc/logger-legacy';

import { CoreFailedPersistenceException } from '../exceptions';
import { ComputeIdp, ComputeSp } from '../types';

@Injectable()
export class CoreAccountService {
  constructor(
    protected readonly logger: LoggerService,
    private readonly account: AccountService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

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
   * @param providerId
   * @param sub
   * @param entityId?
   */

  private getFederation(providerId: string, sub: string, entityId?: string) {
    const key = entityId || providerId;
    return { [key]: { sub } };
  }

  /**
   * Build and persist current interaction with account service
   * @param {string} spId - id of the Service Provider
   * @param {string} entityId -
   * @param {string} subSp - sub of the Service Provider
   * @param {string} hashSp - hash of the Service Provider
   * @param {string} idpId - id of the Identity Provider
   * @param {string} subIdp - sub of the Identity Provider
   */
  async computeFederation(
    { entityId, hashSp, spId, subSp }: ComputeSp,
    { idpId, subIdp }: ComputeIdp,
  ): Promise<string> {
    const spFederation = this.getFederation(spId, subSp, entityId);
    const idpFederation = this.getFederation(idpId, subIdp);

    const interaction = {
      // service provider Hash is used as main identity hash
      identityHash: hashSp,
      // federation for each sides
      idpFederation: idpFederation,
      // Set last connection time to now
      lastConnection: new Date(),
      spFederation: spFederation,
    };

    this.logger.trace(interaction);

    try {
      const accountId = await this.account.storeInteraction(interaction);

      return accountId;
    } catch (error) {
      throw new CoreFailedPersistenceException(error);
    }
  }
}
