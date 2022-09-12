import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { PartnerAccountService } from '@fc/partner-account';
import { PartnerServiceProviderService } from '@fc/partner-service-provider';

import { ILoggedUser, IServiceProviderList } from '../interfaces';

@Injectable()
export class PartnersService {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnerAccount: PartnerAccountService,
    private readonly partnerServiceProvider: PartnerServiceProviderService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async login(email: string): Promise<ILoggedUser> {
    const { id, firstname, lastname, createdAt, updatedAt } =
      await this.partnerAccount.findByEmail(email);

    return {
      id,
      email,
      firstname,
      lastname,
      createdAt,
      updatedAt,
    };
  }

  async getServiceProvidersByAccount(
    accountId: string,
    offset: number,
    size: number,
  ): Promise<IServiceProviderList> {
    const { totalItems, items } =
      await this.partnerServiceProvider.getServiceProvidersListByAccount(
        accountId,
        offset,
        size,
      );

    return {
      meta: { totalItems },
      payload: items,
    };
  }
}
