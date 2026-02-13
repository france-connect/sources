import { Injectable } from '@nestjs/common';

import { PartnersServiceProvider } from '@entities/typeorm';

import { I18nService } from '@fc/i18n';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';

import { PartnersServiceProviderPayloadInterface } from '../interfaces';

@Injectable()
export class PartnersServiceProviderFormService {
  constructor(
    private readonly i18n: I18nService,
    private readonly logger: LoggerService,
    private readonly scopesService: ScopesService,
  ) {}

  toDisplayValue(
    serviceProvider: PartnersServiceProvider,
  ): PartnersServiceProviderPayloadInterface {
    const datapassClaims = serviceProvider.datapassScopes || [];

    const datapassClaimLabels = datapassClaims
      .map((claim) => {
        try {
          return this.i18n.translate(`datapassScope.${claim}`);
        } catch {
          this.logger.warning(`Missing translation for datapassScope.${claim}`);
          return claim;
        }
      })
      .filter(Boolean);

    const baseClaims =
      this.scopesService.getRawClaimsFromScopes(datapassClaims);

    const fcScopes = this.scopesService.getScopesFromClaims(baseClaims);

    return {
      id: serviceProvider.id,
      name: serviceProvider.name,
      organizationName: serviceProvider.organizationName,
      datapassRequestId: serviceProvider.datapassRequestId,
      datapassScopes: datapassClaimLabels,
      fcScopes: fcScopes,
      createdAt: serviceProvider.createdAt,
      updatedAt: serviceProvider.updatedAt,
    };
  }
}
