import { QueryRunner } from 'typeorm';

import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import {
  EnvironmentEnum,
  PartnersServiceProviderInstance,
  PublicationStatusEnum,
} from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissions,
  AccountPermissionService,
  EntityType,
  PermissionInterface,
  PermissionsType,
  RequirePermission,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import {
  ActionTypes,
  ConfigCreateViaMessageDtoPayload,
  CreatedVia,
} from '@fc/csmr-config-client';
import { CsrfTokenGuard } from '@fc/csrf';
import { FormValidationPipe } from '@fc/dto2form';
import { PartnersAccountSession } from '@fc/partners-account';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { ISessionService, Session } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { PartnersBackRoutes } from '../enums';
import {
  PartnerPublicationService,
  PartnersInstanceVersionFormService,
} from '../services';

@Controller()
@Injectable()
export class InstanceController {
  // More than 4 parameters authorized for a controller
  // eslint-disable-next-line max-params
  constructor(
    private readonly instance: PartnersServiceProviderInstanceService,
    private readonly version: PartnersServiceProviderInstanceVersionService,
    private readonly publication: PartnerPublicationService,
    private readonly form: PartnersInstanceVersionFormService,
    private readonly accessControl: AccountPermissionService,
    private readonly typeorm: TypeormService,
  ) {}

  @Get(PartnersBackRoutes.SP_INSTANCES)
  @RequirePermission({
    permissionType: PermissionsType.LIST,
    entity: EntityType.SP_INSTANCE,
  })
  @UseGuards(AccessControlGuard)
  async retrieveVersions(
    @AccountPermissions() permissions: PermissionInterface[],
  ): Promise<FSA<FSAMeta, PartnersServiceProviderInstance[]>> {
    const instances = await this.instance.getAllowedInstances(permissions);

    return {
      type: 'INSTANCE',
      payload: instances,
    };
  }

  @Get(PartnersBackRoutes.SP_INSTANCE)
  @RequirePermission({
    permissionType: PermissionsType.VIEW,
    entity: EntityType.SP_INSTANCE,
    entityIdLocation: { src: 'params', key: 'instanceId' },
  })
  @UseGuards(AccessControlGuard)
  async retrieveInstance(
    @Param('instanceId') instanceId: string,
  ): Promise<FSA<FSAMeta, PartnersServiceProviderInstance>> {
    const instance = await this.instance.getById(instanceId);
    const payload = this.form.toFormValues(instance);

    return {
      type: 'INSTANCE',
      payload,
    };
  }

  @Post(PartnersBackRoutes.SP_INSTANCES)
  @RequirePermission({
    permissionType: PermissionsType.LIST,
    entity: EntityType.SP_INSTANCE,
  })
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(FormValidationPipe)
  async createInstance(
    @Body() values: ServiceProviderInstanceVersionDto,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ): Promise<FSA<FSAMeta, unknown>> {
    const {
      identity: { id: accountId, email },
    } = sessionPartnersAccount.get();
    const data = await this.form.fromFormValues(values);

    const { instanceId, versionId } = await this.typeorm.withTransaction<{
      instanceId: string;
      versionId: string;
    }>((queryRunner) =>
      this.createInstanceInDatabase(queryRunner, data, accountId),
    );

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

    return {
      type: 'INSTANCE',
      payload: {},
    };
  }

  private async createInstanceInDatabase(
    queryRunner: QueryRunner,
    data: OidcClientInterface,
    accountId: string,
  ): Promise<{ instanceId: string; versionId: string }> {
    const { id: instanceId } = await this.instance.save(queryRunner, {
      environment: EnvironmentEnum.SANDBOX,
    });

    // Skip "DRAFT" for sandbox since there is no point to update right after creation
    const status = PublicationStatusEnum.PENDING;
    const { id: versionId } = await this.version.create(
      queryRunner,
      data,
      instanceId,
      status,
    );

    await this.accessControl.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: PermissionsType.VIEW,
      entity: EntityType.SP_INSTANCE,
      entityId: instanceId,
    });

    return { instanceId, versionId };
  }

  @Put(PartnersBackRoutes.SP_INSTANCE)
  @RequirePermission({
    permissionType: PermissionsType.VIEW,
    entity: EntityType.SP_INSTANCE,
    entityIdLocation: { src: 'params', key: 'instanceId' },
  })
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(FormValidationPipe)
  async updateInstance(
    @Body() data: ServiceProviderInstanceVersionDto,
    @Param('instanceId') instanceId: string,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ): Promise<FSA<FSAMeta, unknown>> {
    const fullData = await this.form.fromFormValues(data, instanceId);

    // Skip "DRAFT" for sandbox since there is no point to update right after creation
    const status = PublicationStatusEnum.PENDING;

    const versionId = await this.typeorm.withQueryRunner(
      async (queryRunner: QueryRunner) => {
        const { id } = await this.version.create(
          queryRunner,
          fullData,
          instanceId,
          status,
        );

        return id;
      },
    );

    const {
      identity: { email },
    } = sessionPartnersAccount.get();

    const fullDataWithCreatedInfo: ConfigCreateViaMessageDtoPayload = {
      ...fullData,
      updatedBy: email,
    };

    await this.publication.publish(
      instanceId,
      versionId,
      fullDataWithCreatedInfo,
      ActionTypes.CONFIG_UPDATE,
    );

    return {
      type: 'INSTANCE',
      payload: {},
    };
  }
}
