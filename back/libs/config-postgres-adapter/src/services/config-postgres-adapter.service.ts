import { Injectable } from '@nestjs/common';

import {
  PartnersServiceProviderInstance,
  PartnersServiceProviderInstanceVersion,
} from '@entities/typeorm';

import { ConfigDatabaseServiceInterface } from '@fc/csmr-config/interfaces';
import { ConfigMessageDto } from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';

@Injectable()
export class ConfigPostgresAdapterService
  implements ConfigDatabaseServiceInterface
{
  constructor(
    private readonly instances: PartnersServiceProviderInstanceService,
    private readonly versions: PartnersServiceProviderInstanceVersionService,
  ) {}

  async create(message: ConfigMessageDto): Promise<string> {
    return await this.save(message);
  }

  async update(message: ConfigMessageDto): Promise<string> {
    return await this.save(message);
  }

  async save(message: ConfigMessageDto): Promise<string> {
    const instance = await this.getInstance(message);
    const version = await this.getVersion(message, instance);

    if (version.publicationStatus !== message.meta.publicationStatus) {
      version.publicationStatus = message.meta.publicationStatus;

      await this.versions.updateStatus(version);
    }

    return version.id;
  }

  private getInstance(
    message: ConfigMessageDto,
  ): Promise<PartnersServiceProviderInstance | null> {
    let instance = this.instances.getById(message.meta.instanceId);

    if (!instance) {
      instance = this.instances.save(
        message.payload as Partial<PartnersServiceProviderInstance>,
      );
    }

    return instance;
  }

  private getVersion(
    message: ConfigMessageDto,
    instance: PartnersServiceProviderInstance,
  ): Promise<PartnersServiceProviderInstanceVersion> {
    let version = this.versions.getById(message.meta.versionId);

    if (!version) {
      /** @todo #2036 Fix typing once fields are OK  */
      version = this.versions.create(message.payload as any, instance.id);
    }

    return version;
  }
}
