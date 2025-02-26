import { Repository, UpdateResult } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PartnersServiceProviderInstanceVersion,
  PublicationStatusEnum,
} from '@entities/typeorm';

import { uuid } from '@fc/common';
import { OidcClientInterface } from '@fc/service-provider';

@Injectable()
export class PartnersServiceProviderInstanceVersionService {
  constructor(
    @InjectRepository(PartnersServiceProviderInstanceVersion)
    private readonly repository: Repository<PartnersServiceProviderInstanceVersion>,
  ) {}

  async create(
    version: OidcClientInterface,
    instanceId: uuid,
    publicationStatus: PublicationStatusEnum = PublicationStatusEnum.DRAFT,
  ): Promise<PartnersServiceProviderInstanceVersion> {
    const data = {
      data: { ...version },
      instance: instanceId,
      publicationStatus,
    } as unknown as PartnersServiceProviderInstanceVersion;
    const result = await this.repository.save(data);

    return result;
  }

  async getById(
    versionId: string,
  ): Promise<PartnersServiceProviderInstanceVersion | null> {
    const version = await this.repository.findOne({
      where: { id: versionId },
      relations: ['instance'],
    });

    return version;
  }

  async updateStatus(
    version: Partial<PartnersServiceProviderInstanceVersion>,
  ): Promise<UpdateResult> {
    const success = await this.repository.update(
      { id: version.id },
      { publicationStatus: version.publicationStatus },
    );

    return success;
  }
}
