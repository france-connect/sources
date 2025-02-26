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
  AccountPermissionRepository,
  AccountPermissions,
  EntityType,
  PermissionInterface,
  PermissionsType,
  RequirePermission,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { ActionTypes } from '@fc/csmr-config-client/enums';
import { CsrfTokenGuard } from '@fc/csrf';
import { FormValidationPipe } from '@fc/dto2form';
import { PartnersAccountSession } from '@fc/partners-account';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';
import { ISessionService, Session } from '@fc/session';

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
    private readonly accessControl: AccountPermissionRepository,
    private readonly publication: PartnerPublicationService,
    private readonly form: PartnersInstanceVersionFormService,
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
    @Session('PartnersAccount')
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ): Promise<FSA<FSAMeta, unknown>> {
    const {
      identity: { id: accountId },
    } = sessionPartnersAccount.get();
    const data = await this.form.fromFormValues(values);
    const { id: instanceId } = await this.instance.upsert({
      name: data.name,
      environment: EnvironmentEnum.SANDBOX,
    });

    // Skip "DRAFT" for sandbox since there is no point to update right after creation
    const status = PublicationStatusEnum.PENDING;
    const { id: versionId } = await this.version.create(
      data,
      instanceId,
      status,
    );

    await this.accessControl.addVersionPermission(accountId, versionId);
    await this.accessControl.addInstancePermission(accountId, instanceId);

    await this.publication.publish(
      instanceId,
      versionId,
      data,
      ActionTypes.CONFIG_CREATE,
    );

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
  @UseGuards(CsrfTokenGuard)
  @UsePipes(FormValidationPipe)
  async updateInstance(
    @Body() data: ServiceProviderInstanceVersionDto,
    @Param('instanceId') instanceId: string,
    @Session('PartnersAccount')
    sessionPartnersAccount: ISessionService<PartnersAccountSession>,
  ): Promise<FSA<FSAMeta, unknown>> {
    const {
      identity: { id: accountId },
    } = sessionPartnersAccount.get();

    const fullData = await this.form.fromFormValues(data, instanceId);

    await this.instance.upsert(
      {
        name: fullData.name,
      },
      instanceId,
    );

    // Skip "DRAFT" for sandbox since there is no point to update right after creation
    const status = PublicationStatusEnum.PENDING;
    const { id: versionId } = await this.version.create(
      fullData,
      instanceId,
      status,
    );

    await this.accessControl.addVersionPermission(accountId, versionId);

    await this.publication.publish(
      instanceId,
      versionId,
      fullData,
      ActionTypes.CONFIG_UPDATE,
    );

    return {
      type: 'INSTANCE',
      payload: {},
    };
  }
}
