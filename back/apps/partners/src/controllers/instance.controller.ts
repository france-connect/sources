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
  ValidationPipe,
} from '@nestjs/common';

import {
  EnvironmentEnum,
  PartnersAccount,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
  PublicationStatusEnum,
} from '@entities/typeorm';

import {
  AccessControl,
  AccessControlGuard,
  AccountPermissions,
  AccountPermissionService,
  PermissionInterface,
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
import { PartnersServiceProviderService } from '@fc/partners-service-provider';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { ISessionService, Session, SessionService } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { LinkInstancesInputDto } from '../dto';
import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
  DefaultServiceProviderEnum,
  PartnersBackRoutes,
  PartnersPlatformEnum,
} from '../enums';
import { PartnersInstanceNotFoundException } from '../exceptions';
import {
  PartnerPublicationService,
  PartnersInstanceService,
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
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    private readonly typeorm: TypeormService,
    private readonly session: SessionService,
    private readonly serviceProvider: PartnersServiceProviderService,
    private readonly instanceService: PartnersInstanceService,
  ) {}

  @Get(PartnersBackRoutes.SP_INSTANCES)
  @AccessControl([
    {
      permission: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    },
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    },
  ])
  @UseGuards(AccessControlGuard)
  async retrieveVersions(
    @AccountPermissions()
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): Promise<FSA<FSAMeta, PartnersServiceProviderInstance[]>> {
    const {
      identity: { id: accountId },
    } =
      this.session.get<
        PartnersAccountSession<AccessControlEntity, AccessControlPermission>
      >('PartnersAccount');
    const instances = await this.instance.getAllowedInstances(
      permissions,
      accountId,
    );

    return {
      type: 'INSTANCE',
      payload: instances,
    };
  }

  @Get(PartnersBackRoutes.SP_INSTANCE)
  @AccessControl([
    {
      permission: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      entity: AccessControlEntity.SP_INSTANCE,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'instanceId' },
    },
    {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SP_INSTANCE,
      handler: {
        method: AccessControlHandler.RELATED_ENTITY,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        column: 'serviceProvider',
      },
      entityIdLocation: { src: 'params', key: 'instanceId' },
    },
  ])
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
  @AccessControl([
    {
      permission: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    },
  ])
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(FormValidationPipe)
  async createInstance(
    @Body() values: ServiceProviderInstanceVersionDto,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ): Promise<FSA<FSAMeta, unknown>> {
    const {
      identity: { id: accountId, email },
    } = sessionPartnersAccount.get();

    /**
     * Hard coded since we only have permission to create instances for the default low SP
     * WARNING: Getting this parameter from body would imply to add a new AccessControl rule to the controller
     */
    const serviceProviderId = DefaultServiceProviderEnum.DEFAULT_LOW_SP;

    const data = await this.form.fromFormValues(values, serviceProviderId);

    const { instanceId, versionId } = await this.typeorm.withTransaction<{
      instanceId: string;
      versionId: string;
    }>((queryRunner) =>
      this.createInstanceInDatabase(
        queryRunner,
        data,
        accountId,
        serviceProviderId,
      ),
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

  @Get(PartnersBackRoutes.LINKABLE_INSTANCES)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_TECH,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  async retrieveLinkableInstances(
    @Param('serviceProviderId') serviceProviderId: string,
  ): Promise<
    FSA<
      FSAMeta,
      {
        instances: PartnersServiceProviderInstance[];
        serviceProvider: PartnersServiceProvider;
      }
    >
  > {
    const {
      identity: { id: accountId },
    } =
      this.session.get<
        PartnersAccountSession<AccessControlEntity, AccessControlPermission>
      >('PartnersAccount');

    const serviceProvider =
      await this.serviceProvider.getById(serviceProviderId);

    const defaultSpId =
      serviceProvider.platform.name === PartnersPlatformEnum.FRANCE_CONNECT_HIGH
        ? DefaultServiceProviderEnum.DEFAULT_HIGH_SP
        : DefaultServiceProviderEnum.DEFAULT_LOW_SP;

    const instances = await this.instance.getLinkableInstances(
      accountId,
      defaultSpId,
    );

    return {
      type: 'INSTANCE',
      payload: {
        instances,
        serviceProvider,
      },
    };
  }

  @Post(PartnersBackRoutes.LINK_INSTANCES)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.LINKABLE_INSTANCES,
      },
      entityIdLocation: { src: 'body', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_TECH,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.LINKABLE_INSTANCES,
      },
      entityIdLocation: { src: 'body', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.LINKABLE_INSTANCES,
      },
      entityIdLocation: { src: 'body', key: 'serviceProviderId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(ValidationPipe)
  async linkInstancesToServiceProvider(
    @Body() { serviceProviderId, instanceIds }: LinkInstancesInputDto,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ): Promise<FSA<FSAMeta, unknown>> {
    let instances: PartnersServiceProviderInstance[] = [];
    await this.typeorm.withTransaction(async (queryRunner) => {
      await this.instance.linkToServiceProvider(
        queryRunner,
        instanceIds,
        serviceProviderId,
      );

      instances = await this.instance.getByIdsWithQueryRunner(
        queryRunner,
        instanceIds,
      );

      const {
        identity: { id: accountId, email },
      } = sessionPartnersAccount.get();

      for (const instance of instances) {
        await this.instanceService.update(
          queryRunner,
          instance.currentVersion.data,
          instance,
          serviceProviderId,
          email,
        );

        await this.accessControl.removePermissionTransactional(queryRunner, {
          accountId,
          permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
          entity: AccessControlEntity.SP_INSTANCE,
          entityId: instance.id,
        });
      }
    });

    return {
      type: 'INSTANCE',
      payload: instances,
    };
  }

  private async createInstanceInDatabase(
    queryRunner: QueryRunner,
    data: OidcClientInterface,
    accountId: string,
    serviceProviderId: string,
  ): Promise<{ instanceId: string; versionId: string }> {
    const { id: instanceId } = await this.instance.save(queryRunner, {
      environment: EnvironmentEnum.SANDBOX,
      creator: { id: accountId } as PartnersAccount,
      serviceProvider: {
        id: serviceProviderId,
      } as PartnersServiceProvider,
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
      permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      entity: AccessControlEntity.SP_INSTANCE,
      entityId: instanceId,
    });

    return { instanceId, versionId };
  }

  @Put(PartnersBackRoutes.SP_INSTANCE)
  @AccessControl([
    {
      permission: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      entity: AccessControlEntity.SP_INSTANCE,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'instanceId' },
    },
    {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SP_INSTANCE,
      handler: {
        method: AccessControlHandler.RELATED_ENTITY,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        column: 'serviceProvider',
      },
      entityIdLocation: { src: 'params', key: 'instanceId' },
    },
    {
      permission: AccessControlPermission.SP_TECH,
      entity: AccessControlEntity.SP_INSTANCE,
      handler: {
        method: AccessControlHandler.RELATED_ENTITY,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        column: 'serviceProvider',
      },
      entityIdLocation: { src: 'params', key: 'instanceId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(FormValidationPipe)
  async updateInstance(
    @Body() data: ServiceProviderInstanceVersionDto,
    @Param('instanceId') instanceId: string,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ): Promise<FSA<FSAMeta, unknown>> {
    const {
      identity: { email: updatedBy },
    } = sessionPartnersAccount.get();

    await this.typeorm.withTransaction(async (queryRunner) => {
      const instance = await this.instance.getByIdWithQueryRunner(
        queryRunner,
        instanceId,
      );

      if (!instance) {
        throw new PartnersInstanceNotFoundException();
      }

      await this.instanceService.update(
        queryRunner,
        data,
        instance,
        instance.serviceProvider.id,
        updatedBy,
      );
    });
    return {
      type: 'INSTANCE',
      payload: {},
    };
  }
}
