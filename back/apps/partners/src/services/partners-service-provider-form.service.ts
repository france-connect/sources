import { Injectable } from '@nestjs/common';

import { PartnersAccount, PartnersServiceProvider } from '@entities/typeorm';

import { AccountPermissionInterface } from '@fc/access-control';
import { I18nService } from '@fc/i18n';
import { LoggerService } from '@fc/logger';

import { AccessControlPermission } from '../enums';
import { PartnersServiceProviderPayloadInterface } from '../interfaces';

@Injectable()
export class PartnersServiceProviderFormService {
  constructor(
    private readonly i18n: I18nService,
    private readonly logger: LoggerService,
  ) {}

  toDisplayValue(
    serviceProvider: PartnersServiceProvider,
  ): Omit<PartnersServiceProviderPayloadInterface, 'fcScopes'> {
    const datapassScopes = serviceProvider.datapassScopes || [];

    const datapassScopeLabels = datapassScopes
      .map((scope) => {
        try {
          return this.i18n.translate(`datapassScope.${scope}`);
        } catch {
          this.logger.warning(`Missing translation for datapassScope.${scope}`);
          return scope;
        }
      })
      .filter(Boolean);

    const instances = serviceProvider.instances?.map((instance) => ({
      ...instance,
      creator: {
        firstname: instance.creator.firstname,
        lastname: instance.creator.lastname,
      },
    }));

    return {
      id: serviceProvider.id,
      name: serviceProvider.name,
      organization: serviceProvider.organization,
      datapassRequestId: serviceProvider.datapassRequestId,
      instances,
      datapassScopes: datapassScopeLabels,
      createdAt: serviceProvider.createdAt,
      updatedAt: serviceProvider.updatedAt,
    };
  }

  sortPermissions(
    a: AccountPermissionInterface<PartnersAccount, AccessControlPermission>,
    b: AccountPermissionInterface<PartnersAccount, AccessControlPermission>,
  ): number {
    // First SP_ADMIN, then SP_TECH, then SP_CONTRIBUTOR, and sort by lastConnection descending order inside the same permission type
    const order = [
      AccessControlPermission.SP_ADMIN,
      AccessControlPermission.SP_TECH,
      AccessControlPermission.SP_CONTRIBUTOR,
    ];
    const indexA = order.indexOf(a.permissionType);
    const indexB = order.indexOf(b.permissionType);

    if (indexA !== indexB) {
      return indexA - indexB;
    }

    return this.getLastConnectionTime(b) - this.getLastConnectionTime(a);
  }

  private getLastConnectionTime({
    account,
  }: AccountPermissionInterface<
    PartnersAccount,
    AccessControlPermission
  >): number {
    return account.lastConnection?.getTime() || 0;
  }
}
