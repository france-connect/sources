import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccountPermission } from '@entities/typeorm';

import { EntityType, PermissionsType } from '../enums';
import { AccountPermissionRepository } from './account-permission.repository';

jest.mock('../decorators');

describe('AccountPermissionRepository', () => {
  let repository: AccountPermissionRepository;

  const accountPermissionRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const accountIdMock = Symbol('accountIdMock') as unknown as string;
  const idMock = Symbol('id') as unknown as string;
  const itemMock = {};
  const dataMock = [itemMock];
  const emailMock = 'test@email.fr';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersAccountPermission])],
      providers: [AccountPermissionRepository],
    })
      .overrideProvider(getRepositoryToken(PartnersAccountPermission))
      .useValue(accountPermissionRepositoryMock)

      .compile();

    repository = module.get<AccountPermissionRepository>(
      AccountPermissionRepository,
    );

    accountPermissionRepositoryMock.find.mockResolvedValueOnce(dataMock);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('init', () => {
    const dataMock = {
      account: { id: accountIdMock },
      entity: EntityType.SP_INSTANCE,
      permissionType: PermissionsType.LIST,
    };

    it('should not call the save method if accountId found', async () => {
      // Given
      accountPermissionRepositoryMock.findOne.mockResolvedValueOnce(true);

      // When
      await repository.init(accountIdMock);

      // Then
      expect(accountPermissionRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.findOne).toHaveBeenCalledWith({
        where: dataMock,
      });
      expect(accountPermissionRepositoryMock.save).toHaveBeenCalledTimes(0);
    });

    it('should call the save method if no accountId was found', async () => {
      // Given
      accountPermissionRepositoryMock.findOne.mockResolvedValueOnce(false);

      // When
      await repository.init(accountIdMock);

      // Then
      expect(accountPermissionRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.save).toHaveBeenCalledWith(
        dataMock,
      );
    });
  });

  describe('addVersionPermission', () => {
    it('should call the save method with data for version entity', async () => {
      //Given
      const expected = {
        account: { id: accountIdMock },
        entityId: idMock,
        entity: EntityType.SP_INSTANCE_VERSION,
        permissionType: PermissionsType.VIEW,
      };

      // When
      await repository.addVersionPermission(accountIdMock, idMock);

      // Then
      expect(accountPermissionRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.save).toHaveBeenCalledWith(
        expected,
      );
    });
  });

  describe('addInstancePermission', () => {
    it('should call the save method with data for instance entity', async () => {
      //Given
      const expected = {
        account: { id: accountIdMock },
        entityId: idMock,
        entity: EntityType.SP_INSTANCE,
        permissionType: PermissionsType.VIEW,
      };

      // When
      await repository.addInstancePermission(accountIdMock, idMock);

      // Then
      expect(accountPermissionRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.save).toHaveBeenCalledWith(
        expected,
      );
    });
  });

  describe('getByEmail', () => {
    it('should call accountPermission.find() method with selected column and correct where clause', async () => {
      // When
      await repository.getByEmail(emailMock);

      // Then
      expect(accountPermissionRepositoryMock.find).toHaveBeenCalledTimes(1);

      expect(accountPermissionRepositoryMock.find).toHaveBeenCalledWith({
        select: {
          entity: true,
          entityId: true,
          permissionType: true,
        },
        where: {
          account: {
            email: emailMock,
          },
        },
      });
    });

    it('should return the result from accountPermissionRepositoryMock.find', async () => {
      // Given
      const emailMock = 'foo';

      // When
      const result = await repository.getByEmail(emailMock);

      // Then
      expect(result).toBe(dataMock);
    });
  });
});
