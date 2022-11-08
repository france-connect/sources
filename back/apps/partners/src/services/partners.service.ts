import { Injectable } from '@nestjs/common';

import {
  EntityType,
  IPermission,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { FSA, FSAMeta, uuid } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import {
  IServiceProviderItem,
  PartnerServiceProviderService,
} from '@fc/partner-service-provider';

import { PartnersRoutes } from '../enums';
import { IServiceProviderList } from '../interfaces';

@Injectable()
export class PartnersService {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnerServiceProvider: PartnerServiceProviderService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getServiceProviderById(id: uuid): Promise<IServiceProviderItem> {
    const item = await this.partnerServiceProvider.getById(id);

    this.logger.trace({ item });

    return item;
  }

  async getServiceProvidersFromPermissions(
    permissions: IPermission[],
    offset: number,
    size: number,
  ): Promise<IServiceProviderList> {
    const relatedEntitiesOptions = {
      entityTypes: [EntityType.SERVICE_PROVIDER],
    };
    const serviceProvidersIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    this.logger.trace({ permissions, serviceProvidersIds });

    if (serviceProvidersIds.length === 0) {
      return {
        meta: { total: 0 },
        payload: [] as FSA<FSAMeta, IServiceProviderItem>[],
      };
    }

    const { total, items } = await this.partnerServiceProvider.getByIds(
      serviceProvidersIds,
      offset,
      size,
    );

    this.logger.trace({ total, items });

    const payload = this.mapWithMeta(items, permissions);

    return {
      meta: { total },
      payload,
    };
  }

  private mapWithMeta(
    serviceProviderList: IServiceProviderItem[],
    permissions: IPermission[],
  ) {
    const mapped = serviceProviderList.map((serviceProvider) => ({
      type: EntityType.SERVICE_PROVIDER,
      meta: this.buildMetaForServiceProvider(serviceProvider, permissions),
      payload: serviceProvider,
    }));

    return mapped;
  }

  private buildMetaForServiceProvider(
    serviceProvider: IServiceProviderItem,
    accountPermissions: IPermission[],
  ): FSAMeta {
    const { id } = serviceProvider;

    const permissions = this.buildPermissionsMeta(id, accountPermissions);
    const urls = this.buildUrlsMeta(id);

    return {
      permissions,
      urls,
    };
  }

  private buildPermissionsMeta(
    id: uuid,
    accountPermissions: IPermission[],
  ): string[] {
    const permissions = accountPermissions
      .filter(
        (permission) =>
          permission.entity === EntityType.SERVICE_PROVIDER &&
          permission.entityId === id,
      )
      .map(({ permissionType }) => permissionType);

    return permissions;
  }

  private buildUrlsMeta(id: uuid) {
    return {
      edit: PartnersRoutes.SERVICE_PROVIDER_EDIT.replace(':id', id),
      view: PartnersRoutes.SERVICE_PROVIDER_VIEW.replace(':id', id),
    };
  }
}
