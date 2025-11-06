import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import {
  PartnersServiceProviderInstance,
  PartnersServiceProviderInstanceVersion,
} from '@entities/typeorm';

import {
  ConfigDatabaseServiceInterface,
  ConfigSaveResultInterface,
} from '@fc/config-abstract-adapter';
import { ConfigMessageDto } from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { TypeormService } from '@fc/typeorm';

@Injectable()
export class ConfigPostgresAdapterService
  implements ConfigDatabaseServiceInterface
{
  constructor(
    private readonly instances: PartnersServiceProviderInstanceService,
    private readonly versions: PartnersServiceProviderInstanceVersionService,
    private readonly typeorm: TypeormService, // Assuming typeorm is a QueryRunner instance
  ) {}

  async create(message: ConfigMessageDto): Promise<ConfigSaveResultInterface> {
    return await this.save(message);
  }

  async update(message: ConfigMessageDto): Promise<ConfigSaveResultInterface> {
    return await this.save(message);
  }

  private async save(
    message: ConfigMessageDto,
  ): Promise<ConfigSaveResultInterface> {
    const id = await this.typeorm.withTransaction(
      async (queryRunner: QueryRunner) => {
        const instance = await this.getInstance(queryRunner, message);
        const version = await this.getVersion(queryRunner, message, instance);

        if (version.publicationStatus !== message.meta.publicationStatus) {
          version.publicationStatus = message.meta.publicationStatus;
          await this.versions.updateStatusWithQueryRunner(queryRunner, version);
        }

        return {
          id: version.id,
        };
      },
    );

    return id;
  }

  private async getInstance(
    queryRunner: QueryRunner,
    message: ConfigMessageDto,
  ): Promise<PartnersServiceProviderInstance | null> {
    let instance = await this.instances.getByIdWithQueryRunner(
      queryRunner,
      message.meta.instanceId,
    );

    if (!instance) {
      instance = await this.instances.save(queryRunner, {
        id: message.meta.instanceId,
        ...message.payload,
      } as Partial<PartnersServiceProviderInstance>);
    }

    return instance;
  }

  private async getVersion(
    queryRunner: QueryRunner,
    message: ConfigMessageDto,
    instance: PartnersServiceProviderInstance,
  ): Promise<PartnersServiceProviderInstanceVersion> {
    let version = await this.versions.getByIdWithQueryRunner(
      queryRunner,
      message.meta.versionId,
    );

    if (!version) {
      version = await this.versions.create(
        queryRunner,
        message.payload as OidcClientInterface,
        instance.id,
        message.meta.publicationStatus,
      );
    }

    return version;
  }
}
