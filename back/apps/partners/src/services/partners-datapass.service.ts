import { QueryRunner } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { CryptographyService } from '@fc/cryptography';
import { DatapassEvents, SimplifiedDatapassPayload } from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { PartnersAccountService } from '@fc/partners-account';
import {
  PartnersServiceProviderCreationFailureException,
  PartnersServiceProviderService,
} from '@fc/partners-service-provider';
import { TypeormService } from '@fc/typeorm';

import {
  ServiceProviderCreationResultInterface,
  WebhookResponseInterface,
} from '../interfaces';

@Injectable()
export class PartnersDatapassService {
  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly typeorm: TypeormService,
    private readonly accountService: PartnersAccountService,
    private readonly serviceProviderService: PartnersServiceProviderService,
    private readonly accessControlService: AccountPermissionService,
    private readonly crypto: CryptographyService,
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
          (queryRunner) =>
            this.createServiceProviderTransactional(queryRunner, payload),
        );

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

  private async createServiceProviderTransactional(
    queryRunner: QueryRunner,
    payload: SimplifiedDatapassPayload,
  ): Promise<ServiceProviderCreationResultInterface> {
    const { id: serviceProviderId } = await this.createServiceProvider(
      queryRunner,
      payload,
    );

    await this.createUsersFromDatapass(queryRunner, payload, serviceProviderId);

    return {
      serviceProviderId,
    };
  }

  private async createServiceProvider(
    queryRunner: QueryRunner,
    payload: SimplifiedDatapassPayload,
  ): Promise<PartnersServiceProvider> {
    const serviceProviderEntity = new PartnersServiceProvider();
    serviceProviderEntity.name = payload.datapassName;
    serviceProviderEntity.organizationName = payload.organizationName;
    serviceProviderEntity.datapassRequestId = payload.datapassRequestId;
    serviceProviderEntity.authorizedScopes = payload.scopes;

    return await this.serviceProviderService.upsert(
      queryRunner,
      serviceProviderEntity,
    );
  }

  async createUsersFromDatapass(
    queryRunner: QueryRunner,
    { applicant, technicalContact }: SimplifiedDatapassPayload,
    serviceProviderId: string,
  ): Promise<void> {
    const userContacts = [
      {
        email: applicant.email,
        firstname: applicant.firstname,
        lastname: applicant.lastname,
        sub: this.crypto.hash(applicant.email),
      },
      {
        email: technicalContact.email,
        firstname: technicalContact.firstname,
        lastname: technicalContact.lastname,
        sub: this.crypto.hash(technicalContact.email),
      },
    ];

    // Remove duplicates based on email
    const seenEmails = new Set();
    const uniqueContacts = userContacts.filter((contact) => {
      if (seenEmails.has(contact.email)) return false;
      seenEmails.add(contact.email);
      return true;
    });

    for (const contact of uniqueContacts) {
      const accountId = await this.accountService.getOrCreateByEmail(
        queryRunner,
        contact,
      );

      await this.addServiceProviderPermissions(
        queryRunner,
        accountId,
        serviceProviderId,
      );
    }
  }

  private async addServiceProviderPermissions(
    queryRunner: QueryRunner,
    accountId: string,
    serviceProviderId: string,
  ): Promise<void> {
    await this.accessControlService.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: PermissionsType.LIST,
      entity: EntityType.SERVICE_PROVIDER,
    });

    await this.accessControlService.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: PermissionsType.VIEW,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: serviceProviderId,
    });

    await this.accessControlService.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: PermissionsType.LIST,
      entity: EntityType.SP_INSTANCE,
    });
  }
}
