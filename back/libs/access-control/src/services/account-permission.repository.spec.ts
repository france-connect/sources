import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { AccountPermission } from '@entities/typeorm';

import { AccountPermissionRepository } from './account-permission.repository';

jest.mock('../decorators');

describe('AccountPermissionRepository', () => {
  let repository: AccountPermissionRepository;

  const accountPermissionRepositoryMock = {
    find: jest.fn(),
  };

  const itemMock = {};
  const dataMock = [itemMock];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([AccountPermission])],
      providers: [AccountPermissionRepository],
    })
      .overrideProvider(getRepositoryToken(AccountPermission))
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

  describe('getByAccountId', () => {
    it('should call accountPermission.find() method with selected column and correct where clause', async () => {
      // Given
      const idMock = 'foo';
      // When
      await repository.getByAccountId(idMock);
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
            id: idMock,
          },
        },
      });
    });

    it('should return the result from accountPermissionRepositoryMock.find', async () => {
      // Given
      const idMock = 'foo';
      // When
      const result = await repository.getByAccountId(idMock);
      // Then
      expect(result).toBe(dataMock);
    });
  });
});
