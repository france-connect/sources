import { IsNull, QueryRunner, Repository } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PartnersAccount,
  PartnersOrganization,
  PartnersPlatform,
  PartnersServiceProvider,
} from '@entities/typeorm';

import {
  AccountPermissionInterface,
  AccountPermissionService,
} from '@fc/access-control';
import { difference, uuid } from '@fc/common';
import { CryptographyService } from '@fc/cryptography';
import { DatapassEvents, SimplifiedDatapassPayload } from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { PartnersAccountService } from '@fc/partners-account';
import { AccountInitInputInterface } from '@fc/partners-account/interfaces';
import { PartnersOrganizationService } from '@fc/partners-organization';
import {
  PartnersServiceProviderCreationFailureException,
  PartnersServiceProviderService,
} from '@fc/partners-service-provider';
import { TypeormService } from '@fc/typeorm';

import { EidasPlatformMap } from '../const/eidas-platform.map';
import {
  AccessControlEntity,
  AccessControlPermission,
  CreatedBy,
} from '../enums';
import {
  ServiceProviderCreationResultInterface,
  WebhookResponseInterface,
} from '../interfaces';
import { PartnersInstanceService } from './partners-instance.service';

@Injectable()
export class PartnersDatapassService {
  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly typeorm: TypeormService,
    private readonly accountService: PartnersAccountService,
    private readonly serviceProviderService: PartnersServiceProviderService,
    private readonly accessControlService: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    private readonly crypto: CryptographyService,
    private readonly organizationService: PartnersOrganizationService,
    @InjectRepository(PartnersPlatform)
    private readonly platformRepository: Repository<PartnersPlatform>,
    private readonly instance: PartnersInstanceService,
  ) {}

  // Mapping of DataPass events to their handling methods
  private readonly eventHandlers = new Map<DatapassEvents, string>([
    [DatapassEvents.CREATE, 'handleNotImplementedEvent'],
    [DatapassEvents.UPDATE, 'handleNotImplementedEvent'],
    [DatapassEvents.SUBMIT, 'handleNotImplementedEvent'],
    [DatapassEvents.REFUSE, 'handleNotImplementedEvent'],
    [DatapassEvents.REVOKE, 'handleNotImplementedEvent'],
    [DatapassEvents.REQUEST_CHANGES, 'handleNotImplementedEvent'],
    [DatapassEvents.ARCHIVE, 'handleNotImplementedEvent'],
    [DatapassEvents.APPROVE, 'handleApproveEvent'],
    [DatapassEvents.REOPEN, 'handleNotImplementedEvent'],
    [DatapassEvents.CANCEL_REOPENING, 'handleNotImplementedEvent'],
    [DatapassEvents.TRANSFER, 'handleNotImplementedEvent'],
  ]);

  async handleWebhookEvent(
    payload: SimplifiedDatapassPayload,
  ): Promise<WebhookResponseInterface> {
    const { event } = payload;

    // Retrieve and directly call the mapped method
    const handlerMethodName = this.eventHandlers.get(event);
    if (handlerMethodName && typeof this[handlerMethodName] === 'function') {
      return await this[handlerMethodName](payload);
    }

    this.logger.info({
      message: 'DataPass event not implemented',
      event,
      datapassRequestId: payload.datapassRequestId,
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  private async handleApproveEvent(
    payload: SimplifiedDatapassPayload,
  ): Promise<WebhookResponseInterface> {
    try {
      const { serviceProviderId } =
        await this.typeorm.withTransaction<ServiceProviderCreationResultInterface>(
          async (queryRunner) => {
            const { serviceProviderId } =
              await this.upsertServiceProviderTransactional(
                queryRunner,
                payload,
              );

            return { serviceProviderId };
          },
        );

      await this.typeorm.withTransaction(async (queryRunner) => {
        await this.updateInstances(queryRunner, serviceProviderId);
      });

      this.logger.info({
        message:
          'Service Provider created successfully from DataPass approve event',
        serviceProviderId,
        datapassRequestId: payload.datapassRequestId,
      });

      return {
        statusCode: HttpStatus.CREATED,
        serviceProviderId,
      };
    } catch (error) {
      this.logger.warning({
        message:
          'Failed to create Service Provider from DataPass approve event',
        error: error.message,
        stack: error.stack,
        datapassRequestId: payload.datapassRequestId,
      });

      throw new PartnersServiceProviderCreationFailureException(error);
    }
  }

  private handleNotImplementedEvent(
    payload: SimplifiedDatapassPayload,
  ): WebhookResponseInterface {
    this.logger.info({
      message: `DataPass ${payload.event} event not yet implemented`,
      datapassRequestId: payload.datapassRequestId,
    });

    return {
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

  private async upsertServiceProviderTransactional(
    queryRunner: QueryRunner,
    payload: SimplifiedDatapassPayload,
  ): Promise<ServiceProviderCreationResultInterface> {
    const { id: serviceProviderId } = await this.upsertServiceProvider(
      queryRunner,
      payload,
    );

    await this.manageUsersFromDatapass(queryRunner, payload, serviceProviderId);

    return {
      serviceProviderId,
    };
  }

  private async upsertServiceProvider(
    queryRunner: QueryRunner,
    payload: SimplifiedDatapassPayload,
  ): Promise<PartnersServiceProvider> {
    const organizationEntity = new PartnersOrganization();
    organizationEntity.name = payload.organization.name;
    organizationEntity.siret = payload.organization.siret;

    await this.organizationService.upsert(queryRunner, organizationEntity);

    const platformEntity = await this.platformRepository.findOne({
      where: {
        name: EidasPlatformMap[payload.datapassEidasLevel],
      },
    });

    const serviceProviderEntity = new PartnersServiceProvider();
    serviceProviderEntity.name = payload.datapassName;
    serviceProviderEntity.datapassRequestId = payload.datapassRequestId;
    serviceProviderEntity.datapassScopes = payload.scopes;
    serviceProviderEntity.datapassAuthorizationId =
      payload.datapassAuthorizationId;
    serviceProviderEntity.datapassEidasLevel = payload.datapassEidasLevel;

    serviceProviderEntity.organization = organizationEntity;
    serviceProviderEntity.platform = platformEntity;

    return await this.serviceProviderService.upsert(
      queryRunner,
      serviceProviderEntity,
    );
  }

  async manageUsersFromDatapass(
    queryRunner: QueryRunner,
    payload: SimplifiedDatapassPayload,
    serviceProviderId: string,
  ): Promise<void> {
    const newContacts = this.getNewContacts(payload);
    const existingContacts = await this.getExistingContacts(serviceProviderId);

    await this.manageContacts(
      queryRunner,
      newContacts,
      existingContacts,
      serviceProviderId,
    );
  }

  private getNewContacts(
    payload: SimplifiedDatapassPayload,
  ): AccountPermissionInterface<PartnersAccount, AccessControlPermission>[] {
    const { applicant, technicalContact } = payload;

    const userContacts = [
      {
        account: {
          email: applicant.email,
          firstname: applicant.firstname,
          lastname: applicant.lastname,
          phone: applicant.phone,
          sub: this.crypto.hash(applicant.email),
        },
        permissionType: AccessControlPermission.SP_ADMIN,
      },
      {
        account: {
          email: technicalContact.email,
          firstname: technicalContact.firstname,
          lastname: technicalContact.lastname,
          phone: technicalContact.phone,
          sub: this.crypto.hash(technicalContact.email),
        },
        permissionType: AccessControlPermission.SP_TECH,
      },
    ];

    return userContacts as AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >[];
  }

  // Keep the last contact with one e-mail
  private getDistinctContacts(
    newContacts: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >[],
  ): AccountPermissionInterface<PartnersAccount, AccessControlPermission>[] {
    const contactsByEmail = new Map<
      string,
      AccountPermissionInterface<PartnersAccount, AccessControlPermission>
    >();
    for (const contact of newContacts) {
      contactsByEmail.set(contact.account.email, contact);
    }
    return Array.from(contactsByEmail.values());
  }

  private async getExistingContacts(
    serviceProviderId: string,
  ): Promise<
    AccountPermissionInterface<PartnersAccount, AccessControlPermission>[]
  > {
    const contacts = await this.accessControlService.getAccountsByPermissions<
      PartnersAccount,
      AccessControlPermission
    >(
      [AccessControlPermission.SP_ADMIN, AccessControlPermission.SP_TECH],
      AccessControlEntity.SERVICE_PROVIDER,
      serviceProviderId,
    );

    return contacts;
  }

  private async manageContacts(
    queryRunner: QueryRunner,
    newContacts: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >[],
    currentContacts: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >[],
    serviceProviderId: string,
  ) {
    const currentMap = this.mapContacts(currentContacts);
    const currentMapKeys = Object.keys(currentMap);

    const newMap = this.mapContacts(newContacts);
    const newMapKeys = Object.keys(newMap);

    const keysToAdd = difference(newMapKeys, currentMapKeys);

    for (const key of keysToAdd) {
      await this.addContact(queryRunner, newMap[key], serviceProviderId);
    }

    const keysToRemove = difference(currentMapKeys, newMapKeys);

    for (const key of keysToRemove) {
      await this.removeContact(queryRunner, currentMap[key], serviceProviderId);
    }

    const newDistinctContacts = this.getDistinctContacts(newContacts);

    await this.updateContactsData(
      queryRunner,
      currentContacts,
      newDistinctContacts,
    );
  }

  private async addContact(
    queryRunner: QueryRunner,
    accountPermission: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >,
    serviceProviderId: string,
  ) {
    const { account } = accountPermission;

    const accountId = await this.accountService.getOrCreateByEmail(
      queryRunner,
      account as Pick<
        PartnersAccount,
        'email' | 'firstname' | 'lastname' | 'phone' | 'sub'
      >,
      { upsertFields: ['phone'] },
    );

    await this.accessControlService.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.SP_CONTRIBUTOR,
    });

    await this.accessControlService.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: accountPermission.permissionType,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      entityId: serviceProviderId,
    });

    await this.accessControlService.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
    });

    await this.accessControlService.removePermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.SP_CONTRIBUTOR,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      entityId: serviceProviderId,
    });
  }

  private async removeContact(
    queryRunner: QueryRunner,
    contact: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >,
    serviceProviderId: string,
  ) {
    await this.accessControlService.removePermissionTransactional(queryRunner, {
      accountId: contact.account.id,
      permissionType: contact.permissionType,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      entityId: serviceProviderId as uuid,
    });
  }

  /**
   * Update contact data if needed
   * Business rule: Only update phone number if it has changed, use email as pivot
   */
  private async updateContactsData(
    queryRunner: QueryRunner,
    existingContacts: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >[],
    newContacts: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >[],
  ): Promise<void> {
    for (const contact of existingContacts) {
      const freshData = newContacts.find(
        (newContact) =>
          newContact.account.email === contact.account.email &&
          !!newContact.account.phone &&
          newContact.account.phone !== contact.account.phone,
      );

      if (freshData) {
        await this.accountService.updateAccountTransactional(queryRunner, {
          email: freshData.account.email,
          phone: freshData.account.phone,
        } as AccountInitInputInterface);
      }
    }

    for (const contact of newContacts) {
      const data = {
        email: contact.account.email,
        firstname: contact.account.firstname,
        lastname: contact.account.lastname,
      } as AccountInitInputInterface;

      const where = { email: contact.account.email, lastConnection: IsNull() };

      await this.accountService.updateAccountTransactional(
        queryRunner,
        data,
        where,
      );
    }
  }

  private mapContacts(
    contacts: AccountPermissionInterface<
      PartnersAccount,
      AccessControlPermission
    >[],
  ): Record<
    string,
    AccountPermissionInterface<PartnersAccount, AccessControlPermission>
  > {
    const newIndex = {};

    contacts.forEach((contact) => {
      newIndex[`${contact.account.email}:${contact.permissionType}`] = contact;
    });

    return newIndex;
  }

  private async updateInstances(
    queryRunner: QueryRunner,
    serviceProviderId: string,
  ): Promise<void> {
    const serviceProvider =
      await this.serviceProviderService.getByIdTransactional(
        queryRunner,
        serviceProviderId,
      );

    for (const instance of serviceProvider.instances) {
      try {
        await this.instance.update(
          queryRunner,
          instance.currentVersion.data,
          instance,
          serviceProviderId,
          CreatedBy.DATAPASS,
        );
      } catch (error) {
        this.logger.warning({
          message: 'Failed to update instances',
          error: error.message,
          stack: error.stack,
          instance,
          serviceProviderId,
        });
      }
    }
  }
}
