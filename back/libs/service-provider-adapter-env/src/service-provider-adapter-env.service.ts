import { cloneDeep } from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import {
  IServiceProviderAdapter,
  ServiceProviderMetadata,
  ServiceProviderMetadataList,
} from '@fc/oidc';

import { ServiceProviderAdapterEnvConfig } from './dto';

@Injectable()
export class ServiceProviderAdapterEnvService
  implements IServiceProviderAdapter
{
  constructor(private readonly config: ConfigService) {}

  // Needed to match the interface
  // eslint-disable-next-line require-await
  async getList(): Promise<ServiceProviderMetadata[]> {
    const { list } = this.config.get<ServiceProviderAdapterEnvConfig>(
      'ServiceProviderAdapterEnv',
    ) as ServiceProviderMetadataList;

    return cloneDeep(list);
  }

  async shouldExcludeIdp(spId: string, idpId: string): Promise<boolean> {
    const { idpFilterExclude, idpFilterList } = await this.getById(spId);
    const idpFound = idpFilterList.includes(idpId);

    return idpFilterExclude ? idpFound : !idpFound;
  }

  async getById(id: string): Promise<ServiceProviderMetadata> {
    const list = await this.getList();
    // openid defined property names
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return list.find(({ client_id: dbId }) => dbId === id);
  }
}
