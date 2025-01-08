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
  PartnersServiceProviderInstance,
} from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissionRepository,
  AccountPermissions,
  EntityType,
  PermissionInterface,
  PermissionsType,
  RequirePermission,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { CsrfTokenGuard } from '@fc/csrf';
import { PartnersAccountSession } from '@fc/partners-account';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';
import { ISessionService, Session } from '@fc/session';

import { PartnersBackRoutes } from '../enums';

@Controller()
@Injectable()
export class InstanceController {
  constructor(
    private readonly instance: PartnersServiceProviderInstanceService,
    private readonly version: PartnersServiceProviderInstanceVersionService,
    private readonly accessControl: AccountPermissionRepository,
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
    const payload = await this.instance.getAllowedInstances(permissions);

    return {
      type: 'INSTANCE',
      payload,
    };
  }

  @Get(PartnersBackRoutes.SP_INSTANCE)
  @RequirePermission({
    permissionType: PermissionsType.VIEW,
    entity: EntityType.SP_INSTANCE,
    entityIdLocation: { src: 'params', key: 'instanceId' },
  })
  @UseGuards(AccessControlGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async retrieveInstance(
    @Param('instanceId') instanceId: string,
  ): Promise<FSA<FSAMeta, PartnersServiceProviderInstance>> {
    const payload = await this.instance.getById(instanceId);

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
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(CsrfTokenGuard)
  async createInstance(
    @Body() data: ServiceProviderInstanceVersionDto,
    @Session('PartnersAccount')
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ): Promise<FSA<FSAMeta, unknown>> {
    const { id: instanceId } = await this.instance.upsert({
      name: data.instance_name,
      environment: EnvironmentEnum.SANDBOX,
    });

    const { id: versionId } = await this.version.create(data, instanceId);

    const { accountId } = sessionPartnersAccount.get();

    await this.accessControl.addVersionPermission(accountId, versionId);

    await this.accessControl.addInstancePermission(accountId, instanceId);

    return {
      type: 'INSTANCE',
      payload: {},
    };
  }

  @Put(PartnersBackRoutes.SP_INSTANCE)
  @RequirePermission({
    permissionType: PermissionsType.VIEW,
    entity: EntityType.SP_INSTANCE,
    entityIdLocation: { src: 'params', key: 'instanceId' },
  })
  @UseGuards(AccessControlGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(CsrfTokenGuard)
  async updateInstance(
    @Body() data: ServiceProviderInstanceVersionDto,
    @Param('instanceId') instanceId: string,
    @Session('PartnersAccount')
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ): Promise<FSA<FSAMeta, unknown>> {
    await this.instance.upsert(
      {
        name: data.instance_name,
      },
      instanceId,
    );

    const { id: versionId } = await this.version.create(data, instanceId);

    const { accountId } = sessionPartnersAccount.get();
    await this.accessControl.addVersionPermission(accountId, versionId);

    return {
      type: 'INSTANCE',
      payload: {},
    };
  }
}
