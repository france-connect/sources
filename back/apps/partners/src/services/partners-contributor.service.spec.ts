import { Test, TestingModule } from '@nestjs/testing';

import { AccountPermissionService } from '@fc/access-control';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { Dto2FormValidationErrorException } from '@fc/dto2form/exceptions';
import { LoggerService } from '@fc/logger';
import { MailerService } from '@fc/mailer';
import { PartnersAccountService } from '@fc/partners-account';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';
import { TypeormService } from '@fc/typeorm';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import { AccessControlEntity, AccessControlPermission } from '../enums';
import { PartnersContributorService } from './partners-contributor.service';

describe('PartnersContributorService', () => {
  let service: PartnersContributorService;

  const email = 'foo@bar.com';
  const serviceProviderId = 'service-provider-id-mock';
  const accountIdMock = 'account-id-mock';
  const subMock = 'hashed-email';

  const serviceProviderNameMock = 'Service Provider Name Mock';
  const fqdnMock = 'partners.fqdn-mock.fr';
  const expectedServiceProviderLink = `https://${fqdnMock}/fournisseurs-de-service`;
  const mailerFromMock = {
    email: 'ne-pas-repondre@mock.fr',
    name: 'FranceConnect - Espace Partenaires',
  };
  const emailBodyMock = '<html>add contributor body</html>';
  const expectedSubject = `Vous avez été ajouté(e) comme contributeur au fournisseur de service ${serviceProviderNameMock}`;
  const addedByMock = { firstname: 'Jean', lastname: 'Dupont' };
  const expectedAddedByName = 'Jean Dupont';

  const partnersAccountServiceMock = {
    getOrCreateByEmail: jest.fn(),
  };
  const accountPermissionServiceMock = {
    addPermissionTransactional: jest.fn(),
    hasPermission: jest.fn(),
  };
  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const cryptographyServiceMock = {
    hash: jest.fn(),
  };

  const configServiceMock = getConfigMock();
  const loggerServiceMock = getLoggerMock();
  const mailerServiceMock = {
    send: jest.fn(),
    mailToSend: jest.fn(),
  };
  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersContributorService,
        ConfigService,
        LoggerService,
        MailerService,
        PartnersServiceProviderService,
        PartnersAccountService,
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
        TypeormService,
        CryptographyService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .overrideProvider(PartnersServiceProviderService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(PartnersAccountService)
      .useValue(partnersAccountServiceMock)
      .overrideProvider(
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
      )
      .useValue(accountPermissionServiceMock)
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .compile();

    service = module.get<PartnersContributorService>(
      PartnersContributorService,
    );

    cryptographyServiceMock.hash.mockReturnValue(subMock);
    typeormServiceMock.withTransaction.mockImplementation((callback) =>
      callback(queryRunnerMock),
    );
    accountPermissionServiceMock.hasPermission.mockResolvedValue(false);
    partnersAccountServiceMock.getOrCreateByEmail.mockResolvedValue(
      accountIdMock,
    );

    configServiceMock.get.mockImplementation((name: string) => {
      switch (name) {
        case 'Mailer':
          return { from: mailerFromMock };
        case 'App':
          return { fqdn: fqdnMock };
        default:
          return {};
      }
    });
    serviceProviderServiceMock.getById.mockResolvedValue({
      name: serviceProviderNameMock,
    });
    mailerServiceMock.mailToSend.mockResolvedValue(emailBodyMock);
    mailerServiceMock.send.mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addOne', () => {
    beforeEach(() => {
      service['sendAddContributorEmail'] = jest.fn();
    });

    it('should check duplicates with the normalized email, scoped to the service provider and all conflicting permissions', async () => {
      // When
      await service.addOne('FOO@bar.com', serviceProviderId, addedByMock);

      // Then
      expect(
        accountPermissionServiceMock.hasPermission,
      ).toHaveBeenCalledExactlyOnceWith(
        email,
        [
          AccessControlPermission.SP_ADMIN,
          AccessControlPermission.SP_TECH,
          AccessControlPermission.SP_CONTRIBUTOR,
        ],
        AccessControlEntity.SERVICE_PROVIDER,
        serviceProviderId,
      );
    });

    it('should throw if the email already holds a conflicting permission on the service provider', async () => {
      // Given
      accountPermissionServiceMock.hasPermission.mockResolvedValue(true);

      // When / Then
      await expect(
        service.addOne(email, serviceProviderId, addedByMock),
      ).rejects.toThrow(Dto2FormValidationErrorException);
      expect(typeormServiceMock.withTransaction).not.toHaveBeenCalled();
    });

    it('should not throw when the email holds no conflicting permission', async () => {
      // When / Then
      await expect(
        service.addOne(email, serviceProviderId, addedByMock),
      ).resolves.toBeUndefined();
    });

    it('should grant the global baseline permissions then the one scoped to the service provider', async () => {
      // When
      await service.addOne(email, serviceProviderId, addedByMock);

      // Then
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledTimes(3);
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenNthCalledWith(1, queryRunnerMock, {
        accountId: accountIdMock,
        permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      });
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenNthCalledWith(2, queryRunnerMock, {
        accountId: accountIdMock,
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
      });
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenNthCalledWith(3, queryRunnerMock, {
        accountId: accountIdMock,
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        entityId: serviceProviderId,
      });
    });

    it('should get or create the account from the normalized email without overwriting its identity', async () => {
      // When
      await service.addOne('FOO@bar.com', serviceProviderId, addedByMock);

      // Then
      expect(
        partnersAccountServiceMock.getOrCreateByEmail,
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        { email, sub: subMock },
        { upsertFields: ['email'] },
      );
      const [, accountArg] =
        partnersAccountServiceMock.getOrCreateByEmail.mock.calls[0];
      expect(accountArg).not.toHaveProperty('firstname');
      expect(accountArg).not.toHaveProperty('lastname');
    });

    it('should send the add contributor email with the normalized email after the permission has been created', async () => {
      // When
      await service.addOne('FOO@bar.com', serviceProviderId, addedByMock);

      // Then
      expect(
        service['sendAddContributorEmail'],
      ).toHaveBeenCalledExactlyOnceWith(email, serviceProviderId, addedByMock);

      const permissionOrder =
        accountPermissionServiceMock.addPermissionTransactional.mock
          .invocationCallOrder[0];
      const sendOrder = (service['sendAddContributorEmail'] as jest.Mock).mock
        .invocationCallOrder[0];
      expect(permissionOrder).toBeLessThan(sendOrder);
    });

    it('should not send the add contributor email when the contributor already exists', async () => {
      // Given
      accountPermissionServiceMock.hasPermission.mockResolvedValue(true);

      // When / Then
      await expect(
        service.addOne(email, serviceProviderId, addedByMock),
      ).rejects.toThrow(Dto2FormValidationErrorException);
      expect(service['sendAddContributorEmail']).not.toHaveBeenCalled();
    });
  });

  describe('sendAddContributorEmail', () => {
    it('should fetch the service provider by id to build the email', async () => {
      // When
      await service['sendAddContributorEmail'](
        email,
        serviceProviderId,
        addedByMock,
      );

      // Then
      expect(
        serviceProviderServiceMock.getById,
      ).toHaveBeenCalledExactlyOnceWith(serviceProviderId);
    });

    it('should render the template with the contributor data and the partners service provider link', async () => {
      // When
      await service['sendAddContributorEmail'](
        email,
        serviceProviderId,
        addedByMock,
      );

      // Then
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledExactlyOnceWith(
        'add-contributor-email.ejs',
        {
          recipientEmail: email,
          serviceProviderName: serviceProviderNameMock,
          serviceProviderLink: expectedServiceProviderLink,
          addedByName: expectedAddedByName,
        },
      );
    });

    it('should format the admin name as firstname followed by lastname', async () => {
      // When
      await service['sendAddContributorEmail'](email, serviceProviderId, {
        firstname: 'Édith',
        lastname: 'Piaf',
      });

      // Then
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledExactlyOnceWith(
        'add-contributor-email.ejs',
        expect.objectContaining({ addedByName: 'Édith Piaf' }),
      );
    });

    it('should send the rendered email to the contributor address', async () => {
      // When
      await service['sendAddContributorEmail'](
        email,
        serviceProviderId,
        addedByMock,
      );

      // Then
      expect(mailerServiceMock.send).toHaveBeenCalledExactlyOnceWith({
        from: mailerFromMock,
        to: [{ email }],
        subject: expectedSubject,
        body: emailBodyMock,
      });
    });

    describe('when the email sending fails (non-blocking)', () => {
      it('should resolve and log when the service provider lookup fails', async () => {
        // Given
        const error = new Error('service provider not found');
        serviceProviderServiceMock.getById.mockRejectedValue(error);

        // When / Then
        await expect(
          service['sendAddContributorEmail'](
            email,
            serviceProviderId,
            addedByMock,
          ),
        ).resolves.toBeUndefined();

        expect(mailerServiceMock.send).not.toHaveBeenCalled();
        expect(loggerServiceMock.err).toHaveBeenCalledExactlyOnceWith(
          error,
          expect.any(String),
        );
      });

      it('should resolve and log when the template rendering fails', async () => {
        // Given
        const error = new Error('template not found');
        mailerServiceMock.mailToSend.mockRejectedValue(error);

        // When / Then
        await expect(
          service['sendAddContributorEmail'](
            email,
            serviceProviderId,
            addedByMock,
          ),
        ).resolves.toBeUndefined();

        expect(mailerServiceMock.send).not.toHaveBeenCalled();
        expect(loggerServiceMock.err).toHaveBeenCalledExactlyOnceWith(
          error,
          expect.any(String),
        );
      });

      it('should resolve and log when the email transport fails', async () => {
        // Given
        const error = new Error('smtp down');
        mailerServiceMock.send.mockRejectedValue(error);

        // When / Then
        await expect(
          service['sendAddContributorEmail'](
            email,
            serviceProviderId,
            addedByMock,
          ),
        ).resolves.toBeUndefined();

        expect(loggerServiceMock.err).toHaveBeenCalledExactlyOnceWith(
          error,
          expect.any(String),
        );
      });
    });
  });
});
