import { Test, TestingModule } from '@nestjs/testing';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { CryptographyService } from '@fc/cryptography';
import { PartnersAccountService } from '@fc/partners-account';
import { TypeormService } from '@fc/typeorm';

import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import { PartnersInvitationService } from './partners-invitation.service';

describe('PartnersInvitationService', () => {
  let service: PartnersInvitationService;

  const emails = ['foo@bar.com', 'fizz@buzz.fr'];
  const instances = ['instanceId1', 'instanceId2'];

  const partnersAccountServiceMock = {
    getOrCreateByEmail: jest.fn(),
  };
  const accountPermissionServiceMock = {
    addPermissionTransactional: jest.fn(),
  };
  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const cryptographyServiceMock = {
    hash: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersInvitationService,
        PartnersAccountService,
        AccountPermissionService,
        TypeormService,
        CryptographyService,
      ],
    })
      .overrideProvider(PartnersAccountService)
      .useValue(partnersAccountServiceMock)
      .overrideProvider(AccountPermissionService)
      .useValue(accountPermissionServiceMock)
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .compile();

    service = module.get<PartnersInvitationService>(PartnersInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('inviteMany', () => {
    it('should call inviteOne for each email', async () => {
      // Given
      service.inviteOne = jest.fn();

      // When
      await service.inviteMany(emails, instances);

      // Then
      expect(service.inviteOne).toHaveBeenCalledTimes(2);
      expect(service.inviteOne).toHaveBeenNthCalledWith(
        1,
        emails[0],
        instances,
      );
      expect(service.inviteOne).toHaveBeenNthCalledWith(
        2,
        emails[1],
        instances,
      );
    });
  });

  describe('inviteOne', () => {
    // Given
    const email = emails[0];
    const account = {
      email,
      firstname: 'N/A',
      lastname: 'N/A',
      sub: 'hashed-email',
    };
    const accountIdMock = 'account-id-mock';

    beforeEach(() => {
      cryptographyServiceMock.hash.mockReturnValue(account.sub);
      typeormServiceMock.withTransaction.mockImplementation((callback) =>
        callback(queryRunnerMock),
      );
      partnersAccountServiceMock.getOrCreateByEmail.mockResolvedValue(
        accountIdMock,
      );
      service['addInstancesPermissions'] = jest.fn();
    });

    it('should create an account and add permissions', async () => {
      // When
      await service.inviteOne(email, instances);

      // Then
      expect(
        partnersAccountServiceMock.getOrCreateByEmail,
      ).toHaveBeenCalledWith(queryRunnerMock, account);
    });

    it('should add LIST permission for SP_INSTANCE entity', async () => {
      // When
      await service.inviteOne(email, instances);

      // Then
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId: accountIdMock,
        permissionType: PermissionsType.LIST,
        entity: EntityType.SP_INSTANCE,
      });
    });

    it('should add permissions for each instance', async () => {
      // When
      await service.inviteOne(email, instances);

      // Then
      expect(service['addInstancesPermissions']).toHaveBeenCalledWith(
        queryRunnerMock,
        accountIdMock,
        instances,
      );
    });
  });

  describe('addInstancesPermissions', () => {
    it('should call addPermissionTransactional for each instance', async () => {
      // Given
      const accountIdMock = 'account-id-mock';

      // When
      await service['addInstancesPermissions'](
        queryRunnerMock,
        accountIdMock,
        instances,
      );

      // Then
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledTimes(2);
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenNthCalledWith(1, queryRunnerMock, {
        accountId: accountIdMock,
        permissionType: PermissionsType.VIEW,
        entity: EntityType.SP_INSTANCE,
        entityId: instances[0],
      });
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenNthCalledWith(2, queryRunnerMock, {
        accountId: accountIdMock,
        permissionType: PermissionsType.VIEW,
        entity: EntityType.SP_INSTANCE,
        entityId: instances[1],
      });
    });
  });
});
