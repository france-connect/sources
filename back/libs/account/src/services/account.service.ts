import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { LoggerService } from '@fc/logger-legacy';

import { AccountNotFoundException } from '../exceptions';
import { IInteraction } from '../interfaces';
import { Account } from '../schemas';

@Injectable()
export class AccountService {
  constructor(
    private readonly logger: LoggerService,
    @InjectModel('Account') private model: Model<Account>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Check in database if an account is registered and blocked
   * with provided identityHash
   *
   * @param identityHash
   */
  async isBlocked(identityHash: string): Promise<boolean> {
    const account = await this.model.findOne({
      identityHash,
      active: false,
    });

    return account !== null;
  }

  /**
   * Save interaction to database
   *
   * @param {IInteraction} interaction
   * @returns {Promise<void>}
   */
  async storeInteraction(interaction: IInteraction): Promise<string> {
    this.logger.debug('Save interaction to database');

    const account = await this.getAccountWithInteraction(interaction);

    await account.save();

    return account.id;
  }

  /**
   * Create an account object (model instance)
   * with data up to date with given interaction.
   *
   * Previous interactions are
   *  - preserved if provider is different
   *  - updated when provider is the same (though sub should not change)
   *
   * @param {IInteraction} interaction
   * @returns {Promise<Account>} an up-to-date `Account` object
   */
  private async getAccountWithInteraction(
    interaction: IInteraction,
  ): Promise<Account> {
    const { identityHash } = interaction;

    // Get existing account or create one
    let account = await this.model.findOne({ identityHash });

    if (!account) {
      account = new this.model({ identityHash });
    }

    // Spread new interactions
    account.spFederation = {
      ...account.spFederation,
      ...interaction.spFederation,
    };

    // Update last connection timestamp
    account.lastConnection = interaction.lastConnection;

    return account;
  }

  /**
   * Get an `Account` object from an `identityHash`.
   * It throw an error if the account is not found.
   *
   * @see CryptographyFcpService.computeIdentityHash()
   * @param {string} identityHash
   * @returns {Promise<Account>}
   */
  async getAccountByIdentityHash(identityHash: string): Promise<Account> {
    this.logger.debug(`Recherche d'un compte avec via son hash`);
    const account: Account = await this.model.findOne({ identityHash });
    this.logger.trace({ account });

    return account || ({ id: null } as Account);
  }

  /**
   * Update an Account preferences
   * @param {string} identityHash
   * @param {string[]} identityProviderList
   * @param {boolean} isExcludeList
   * @returns {Promise<Account>}
   */
  async updatePreferences(
    identityHash: string,
    identityProviderList: string[],
    isExcludeList: boolean,
  ): Promise<Pick<Account, 'id' | 'preferences'> & { updatedAt: Date }> {
    this.logger.debug(
      `Update account preferences ${identityHash} with ${identityProviderList} (isExcludeList: ${isExcludeList})`,
    );
    const updatedAt = new Date();
    const accountBeforeUpdate = await this.model.findOneAndUpdate(
      { identityHash },
      {
        preferences: {
          idpSettings: {
            updatedAt,
            list: identityProviderList,
            isExcludeList,
          },
        },
      },
    );

    if (!accountBeforeUpdate) {
      throw new AccountNotFoundException();
    }

    this.logger.trace({
      id: accountBeforeUpdate.id,
      IdpSettingsBeforeUpdate: accountBeforeUpdate.preferences?.idpSettings,
      newPreferences: {
        identityProviderList,
        isExcludeList,
      },
    });

    const { id, preferences } = accountBeforeUpdate;
    return { id, preferences, updatedAt };
  }
}
