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
import {
  PartnerServiceProviderConfigurationService,
  ServiceProviderConfigurationItemInterface,
  ServiceProviderConfigurationType,
  UrlMetaInterface,
} from '@fc/partner-service-provider-configuration';

import { PartnersRoutes } from '../enums';
import {
  IServiceProviderList,
  ServiceProviderConfigurationListInterface,
} from '../interfaces';

@Injectable()
export class PartnersService {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnerServiceProvider: PartnerServiceProviderService,
    private readonly partnerServiceProviderConfiguration: PartnerServiceProviderConfigurationService,
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

  private buildUrlsMeta(id: uuid): Pick<UrlMetaInterface, 'view' | 'edit'> {
    return {
      edit: PartnersRoutes.SERVICE_PROVIDER_EDIT.replace(':id', id),
      view: PartnersRoutes.SERVICE_PROVIDER_VIEW.replace(':id', id),
    };
  }

  private buildUrls(id: uuid): Pick<UrlMetaInterface, 'view' | 'delete'> {
    const meta = {
      view: `${PartnersRoutes.SERVICE_PROVIDER_CONFIGURATION_LIST}/${id}`,
      delete: `${PartnersRoutes.SERVICE_PROVIDER_CONFIGURATION_DELETE.replace(
        ':id',
        id,
      )}`,
    };

    return meta;
  }

  private buildFSA(
    type: string,
    item: ServiceProviderConfigurationItemInterface,
    urls?: Partial<UrlMetaInterface>,
    total?: number,
  ): FSA<
    FSAMeta,
    Pick<ServiceProviderConfigurationItemInterface, 'id' | 'name'>
  > {
    const { id, name } = item;

    const fsa: FSA<
      FSAMeta,
      Pick<ServiceProviderConfigurationItemInterface, 'id' | 'name'>
    > = {
      type,
      payload: {
        id,
        name,
      },
    };

    if (urls) {
      fsa.meta = {
        urls,
      };
    }

    if (total) {
      fsa.meta = {
        ...fsa.meta,
        total,
      };
    }
    return fsa;
  }

  private mapConfigWithMeta(
    ConfigurationList: ServiceProviderConfigurationItemInterface[],
  ) {
    const mapped = ConfigurationList.map((item) =>
      this.buildFSA(ServiceProviderConfigurationType.ITEM, item),
    );

    return mapped;
  }

  async getConfigurationsFromServiceProvider(
    serviceProviderId: uuid,
  ): Promise<ServiceProviderConfigurationListInterface> {
    const { total, items } =
      await this.partnerServiceProviderConfiguration.getByServiceProvider(
        serviceProviderId,
      );

    const payload = this.mapConfigWithMeta(items);

    /**
     * @todo : Register all type in centralized list
     * author: anatole
     * date: 2022-10-20
     */
    const data: ServiceProviderConfigurationListInterface = {
      type: ServiceProviderConfigurationType.LIST,
      meta: {
        total,
      },
      payload,
    };

    return data;
  }

  async saveConfigurationForServiceProvider(
    serviceProviderId: uuid,
  ): Promise<
    FSA<FSAMeta, Pick<ServiceProviderConfigurationItemInterface, 'id' | 'name'>>
  > {
    const payload =
      await this.partnerServiceProviderConfiguration.addForServiceProvider(
        serviceProviderId,
      );

    const { total } =
      await this.partnerServiceProviderConfiguration.getByServiceProvider(
        serviceProviderId,
      );

    const serviceProviderConfigurationId = payload.id;
    const urls = this.buildUrls(serviceProviderConfigurationId);

    const data = this.buildFSA(
      ServiceProviderConfigurationType.ITEM,
      payload,
      urls,
      total,
    );

    return data;
  }
}
