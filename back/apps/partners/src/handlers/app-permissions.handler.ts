import { isUUID } from 'class-validator';

import { ExecutionContext, Injectable } from '@nestjs/common';

import {
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
} from '@entities/typeorm';

import {
  AccessControlInvalidEntityIdException,
  AccessControlPermissionDataInterface,
  CommonAccessControlHandler,
  PermissionInterface,
} from '@fc/access-control';
import { PartnersAccountSession } from '@fc/partners-account';

import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
  DefaultServiceProviderEnum,
} from '../enums';

@Injectable()
export class AppPermissionsHandler extends CommonAccessControlHandler<
  AccessControlEntity,
  AccessControlPermission,
  AccessControlHandler
> {
  protected async [AccessControlHandler.LINKABLE_INSTANCES](
    permission: AccessControlPermissionDataInterface<
      AccessControlEntity,
      AccessControlPermission,
      AccessControlHandler
    >,
    serviceProviderId: string,
    userPermissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
    context: ExecutionContext,
  ): Promise<boolean> {
    const hasSpAccess = this[AccessControlHandler.DIRECT_ENTITY](
      permission,
      serviceProviderId,
      userPermissions,
    );

    if (!hasSpAccess) {
      return false;
    }

    const instanceIds = this.getInstancesIds(context);

    /**
     * @todo #2519 We should not have to worry about the presence of instanceIds,
     * it should be handled beforehand in input validation.
     */
    if (!instanceIds) {
      return false;
    }

    this.checkInstancesIds(instanceIds);

    return await this.isUserInstanceCreator(instanceIds, serviceProviderId);
  }

  private getInstancesIds(context: ExecutionContext): string[] | undefined {
    const request = context.switchToHttp().getRequest<{
      body?: { instanceIds: string[] };
    }>();

    const { instanceIds } = request.body || {};

    return instanceIds;
  }

  private checkInstancesIds(instanceIds: string[]): void {
    const valid = instanceIds.every((instanceId) => isUUID(instanceId, '4'));

    if (!valid) {
      throw new AccessControlInvalidEntityIdException();
    }
  }

  private async isUserInstanceCreator(
    instanceIds: string[],
    serviceProviderId: string,
  ): Promise<boolean> {
    const {
      identity: { id: accountId },
    } =
      this.sessionService.get<
        PartnersAccountSession<AccessControlEntity, AccessControlPermission>
      >('PartnersAccount');

    const instanceRepository = this.typeorm.getRepository(
      PartnersServiceProviderInstance,
    );

    const platformSubQuery = instanceRepository.manager
      .createQueryBuilder()
      .subQuery()
      .select('sp2.platform')
      .from(PartnersServiceProvider, 'sp2')
      .where('sp2.id = :serviceProviderId')
      .getQuery();

    const count = await instanceRepository
      .createQueryBuilder('instance')
      .innerJoin('instance.creator', 'creator')
      .innerJoin('instance.serviceProvider', 'sp')
      .innerJoin('sp.platform', 'platform')
      .where('instance.id IN (:...instanceIds)', { instanceIds })
      .andWhere('creator.id = :accountId', { accountId })
      .andWhere('sp.id IN (:...defaultSps)', {
        defaultSps: [
          DefaultServiceProviderEnum.DEFAULT_LOW_SP,
          DefaultServiceProviderEnum.DEFAULT_HIGH_SP,
        ],
      })
      .andWhere(`platform.id = ${platformSubQuery}`)
      .setParameter('serviceProviderId', serviceProviderId)
      .getCount();

    return count === instanceIds.length;
  }
}
