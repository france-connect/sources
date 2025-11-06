import { QueryRunner, Repository, UpdateResult } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PartnersServiceProviderInstanceVersion,
  PublicationStatusEnum,
} from '@entities/typeorm';

import { uuid } from '@fc/common';
import { OidcClientInterface } from '@fc/service-provider';
import { getInsertedEntity } from '@fc/typeorm';

@Injectable()
export class PartnersServiceProviderInstanceVersionService {
  constructor(
    @InjectRepository(PartnersServiceProviderInstanceVersion)
    private readonly repository: Repository<PartnersServiceProviderInstanceVersion>,
  ) {}

  async create(
    queryRunner: QueryRunner,
    version: OidcClientInterface,
    instanceId: uuid,
    publicationStatus: PublicationStatusEnum = PublicationStatusEnum.DRAFT,
  ): Promise<PartnersServiceProviderInstanceVersion> {
    const data = {
      data: { ...version },
      instance: instanceId,
      publicationStatus,
    } as unknown as PartnersServiceProviderInstanceVersion;

    const insertResult = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PartnersServiceProviderInstanceVersion)
      .values(data)
      .returning(['id'])
      .execute();

    return getInsertedEntity<PartnersServiceProviderInstanceVersion>(
      insertResult,
    );
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

  async getByIdWithQueryRunner(
    queryRunner: QueryRunner,
    versionId: string,
  ): Promise<PartnersServiceProviderInstanceVersion | null> {
    const version = await queryRunner.manager.findOne(
      PartnersServiceProviderInstanceVersion,
      {
        where: { id: versionId },
        relations: ['instance'],
      },
    );

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

  async updateStatusWithQueryRunner(
    queryRunner: QueryRunner,
    version: Partial<PartnersServiceProviderInstanceVersion>,
  ): Promise<UpdateResult> {
    const success = await queryRunner.manager.update(
      PartnersServiceProviderInstanceVersion,
      { id: version.id },
      { publicationStatus: version.publicationStatus },
    );

    return success;
  }
}
