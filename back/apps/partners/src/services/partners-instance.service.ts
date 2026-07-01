import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import {
  PartnersAccount,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
  PartnersServiceProviderInstanceVersion,
  PublicationStatusEnum,
} from '@entities/typeorm';

import { AccountPermissionService } from '@fc/access-control';
import {
  ActionTypes,
  ConfigCreateViaMessageDtoPayload,
  CreatedVia,
} from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionStandaloneDto,
} from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { TypeormService } from '@fc/typeorm';

import { AccessControlEntity, AccessControlPermission } from '../enums';
import {
  InstanceCreationContextInterface,
  InstanceCreationOptionsInterface,
  InstanceCreationResultInterface,
  InstanceVersionFromSpPayloadInterface,
} from '../interfaces';
import { PartnersInstanceVersionFormService } from './partners-instance-version-form.service';
import { PartnerPublicationService } from './partners-publication.service';

@Injectable()
export class PartnersInstanceService {
  // More than 4 parameters allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly typeorm: TypeormService,
    private readonly instance: PartnersServiceProviderInstanceService,
    private readonly version: PartnersServiceProviderInstanceVersionService,
    private readonly publication: PartnerPublicationService,
    private readonly form: PartnersInstanceVersionFormService,
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
  ) {}

  async create(
    values:
      | ServiceProviderInstanceVersionStandaloneDto
      | InstanceVersionFromSpPayloadInterface
      | OidcClientInterface,
    context: InstanceCreationContextInterface,
    options: InstanceCreationOptionsInterface,
  ): Promise<InstanceCreationResultInterface> {
    const { accountId, email, serviceProviderId } = context;

    const data = await this.form.fromFormValues(values, serviceProviderId);

    const result =
      await this.typeorm.withTransaction<InstanceCreationResultInterface>(
        async (queryRunner) => {
          const created = await this.createInstanceWithVersion(
            queryRunner,
            data,
            { accountId, serviceProviderId },
            options,
          );

          if (options.grantInstanceContributor) {
            await this.grantContributorPermission(
              queryRunner,
              created.instanceId,
              accountId,
            );
          }

          return created;
        },
      );

    await this.publishCreation(result, data, { email });

    return result;
  }

  // It is what it takes...
  // eslint-disable-next-line max-params
  async update(
    queryRunner: QueryRunner,
    data: ServiceProviderInstanceVersionStandaloneDto | OidcClientInterface,
    instance: PartnersServiceProviderInstance,
    serviceProviderId: string,
    updatedBy: string,
  ): Promise<void> {
    const fullData = await this.form.fromFormValues(
      data,
      serviceProviderId,
      instance.id,
    );

    const { id: versionId } = await this.createPendingVersion(
      queryRunner,
      fullData,
      instance.id,
    );

    const fullDataWithCreatedInfo: ConfigCreateViaMessageDtoPayload = {
      ...fullData,
      updatedBy,
    };

    await this.publication.publish(
      instance.id,
      versionId,
      fullDataWithCreatedInfo,
      ActionTypes.CONFIG_UPDATE,
    );
  }

  private async createInstanceWithVersion(
    queryRunner: QueryRunner,
    data: OidcClientInterface,
    {
      accountId,
      serviceProviderId,
    }: Pick<
      InstanceCreationContextInterface,
      'accountId' | 'serviceProviderId'
    >,
    { environment }: InstanceCreationOptionsInterface,
  ): Promise<InstanceCreationResultInterface> {
    const { id: instanceId } = await this.instance.save(queryRunner, {
      environment,
      creator: { id: accountId } as PartnersAccount,
      serviceProvider: {
        id: serviceProviderId,
      } as PartnersServiceProvider,
    });

    const { id: versionId } = await this.createPendingVersion(
      queryRunner,
      data,
      instanceId,
    );

    return { instanceId, versionId };
  }

  // A standalone instance (attached to the default SP) grants its creator a direct
  // INSTANCE_CONTRIBUTOR permission. When created already attached to a real SP,
  // permissions are inherited via RELATED_ENTITY, so the flag is false.
  private async grantContributorPermission(
    queryRunner: QueryRunner,
    instanceId: string,
    accountId: string,
  ): Promise<void> {
    await this.accessControl.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      entity: AccessControlEntity.SP_INSTANCE,
      entityId: instanceId,
    });
  }

  private async publishCreation(
    { instanceId, versionId }: InstanceCreationResultInterface,
    data: OidcClientInterface,
    { email }: Pick<InstanceCreationContextInterface, 'email'>,
  ): Promise<void> {
    const dataWithCreatedInfo: ConfigCreateViaMessageDtoPayload = {
      ...data,
      createdBy: email,
      createdVia: CreatedVia.PARTNERS_MANUAL,
    };

    await this.publication.publish(
      instanceId,
      versionId,
      dataWithCreatedInfo,
      ActionTypes.CONFIG_CREATE,
    );
  }

  private createPendingVersion(
    queryRunner: QueryRunner,
    data: OidcClientInterface,
    instanceId: string,
  ): Promise<PartnersServiceProviderInstanceVersion> {
    return this.version.create(
      queryRunner,
      data,
      instanceId,
      // Skip "DRAFT" for sandbox since there is no point to update right after creation
      PublicationStatusEnum.PENDING,
    );
  }
}
