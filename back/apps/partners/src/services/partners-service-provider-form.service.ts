import { Injectable } from '@nestjs/common';

import { PartnersServiceProvider } from '@entities/typeorm';

import { I18nService } from '@fc/i18n';
import { LoggerService } from '@fc/logger';

import { PartnersServiceProviderPayloadInterface } from '../interfaces';

@Injectable()
export class PartnersServiceProviderFormService {
  constructor(
    private readonly i18n: I18nService,
    private readonly logger: LoggerService,
  ) {}

  toDisplayValue(
    serviceProvider: PartnersServiceProvider,
  ): PartnersServiceProviderPayloadInterface {
    const authorizedScopes = serviceProvider.authorizedScopes || [];

    const datapassScopes = authorizedScopes
      .map((claim) => {
        try {
          return this.i18n.translate(`datapassScope.${claim}`);
        } catch {
          this.logger.warning(`Missing translation for datapassScope.${claim}`);
          return claim;
        }
      })
      .filter((label) => label);

    return {
      id: serviceProvider.id,
      name: serviceProvider.name,
      organizationName: serviceProvider.organizationName,
      datapassRequestId: serviceProvider.datapassRequestId,
      datapassScopes,
      createdAt: serviceProvider.createdAt,
      updatedAt: serviceProvider.updatedAt,
    };
  }
}
