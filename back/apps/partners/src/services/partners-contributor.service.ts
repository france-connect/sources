import { Injectable } from '@nestjs/common';

import { AccountPermissionService } from '@fc/access-control';
import { normalizeEmail } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { MessageLevelEnum, MessagePriorityEnum } from '@fc/dto2form';
import { Dto2FormValidationErrorException } from '@fc/dto2form/exceptions';
import { LoggerService } from '@fc/logger';
import { MailerConfig, MailerService } from '@fc/mailer';
import { PartnersAccountService } from '@fc/partners-account';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';
import { TypeormService } from '@fc/typeorm';

import { AppConfig } from '../dto';
import {
  AccessControlEntity,
  AccessControlPermission,
  EmailsTemplates,
} from '../enums';
import { AddContributorEmailData, UserInfosInterface } from '../interfaces';

const CONTRIBUTOR_CONFLICTING_PERMISSIONS: AccessControlPermission[] = [
  AccessControlPermission.SP_ADMIN,
  AccessControlPermission.SP_TECH,
  AccessControlPermission.SP_CONTRIBUTOR,
];

@Injectable()
export class PartnersContributorService {
  // allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly mailer: MailerService,
    private readonly serviceProvider: PartnersServiceProviderService,
    private readonly partnersAccount: PartnersAccountService,
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    private readonly typeorm: TypeormService,
    private readonly crypto: CryptographyService,
  ) {}

  async addOne(
    email: string,
    serviceProviderId: string,
    addedBy: Pick<UserInfosInterface, 'firstname' | 'lastname'>,
  ): Promise<void> {
    const normalizedEmail = normalizeEmail(email);

    await this.assertNotAlreadyContributor(normalizedEmail, serviceProviderId);

    await this.typeorm.withTransaction(async (queryRunner) => {
      const accountId = await this.partnersAccount.getOrCreateByEmail(
        queryRunner,
        { email: normalizedEmail, sub: this.crypto.hash(normalizedEmail) },
        { upsertFields: ['email'] },
      );

      await this.accessControl.addPermissionTransactional(queryRunner, {
        accountId,
        permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      });

      await this.accessControl.addPermissionTransactional(queryRunner, {
        accountId,
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
      });

      await this.accessControl.addPermissionTransactional(queryRunner, {
        accountId,
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        entityId: serviceProviderId,
      });
    });

    await this.sendAddContributorEmail(
      normalizedEmail,
      serviceProviderId,
      addedBy,
    );
  }

  private async sendAddContributorEmail(
    recipientEmail: string,
    serviceProviderId: string,
    addedBy: Pick<UserInfosInterface, 'firstname' | 'lastname'>,
  ): Promise<void> {
    try {
      const { from } = this.config.get<MailerConfig>('Mailer');
      const { fqdn } = this.config.get<AppConfig>('App');

      const { name: serviceProviderName } =
        await this.serviceProvider.getById(serviceProviderId);

      const emailData: AddContributorEmailData = {
        recipientEmail,
        serviceProviderName,
        serviceProviderLink: `https://${fqdn}/fournisseurs-de-service`,
        addedByName: `${addedBy.firstname} ${addedBy.lastname}`,
      };

      const body = await this.mailer.mailToSend(
        EmailsTemplates.ADD_CONTRIBUTOR_EMAIL,
        emailData,
      );

      await this.mailer.send({
        from,
        to: [{ email: recipientEmail }],
        subject: `Vous avez été ajouté(e) comme contributeur au fournisseur de service ${serviceProviderName}`,
        body,
      });
    } catch (error) {
      this.logger.err(error, 'Failed to send the add contributor email');
    }
  }

  private async assertNotAlreadyContributor(
    email: string,
    serviceProviderId: string,
  ): Promise<void> {
    const isAlreadyContributor = await this.accessControl.hasPermission(
      email,
      CONTRIBUTOR_CONFLICTING_PERMISSIONS,
      AccessControlEntity.SERVICE_PROVIDER,
      serviceProviderId,
    );

    if (isAlreadyContributor) {
      // @TODO #2686
      // https://gitlab.dev-franceconnect.fr/france-connect/fc/-/work_items/2686
      throw new Dto2FormValidationErrorException([
        {
          name: 'email',
          validators: [
            {
              name: 'isNewContributor',
              errorMessage: {
                content: 'isNewContributor_error',
                level: MessageLevelEnum.ERROR,
                priority: MessagePriorityEnum.ERROR,
              },
              validationArgs: [],
            },
          ],
        },
      ]);
    }
  }
}
