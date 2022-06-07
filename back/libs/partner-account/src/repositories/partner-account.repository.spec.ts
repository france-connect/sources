import { Test, TestingModule } from '@nestjs/testing';

import { Account } from '@entities/typeorm';

import { PostgresConnectionFailure } from '../exceptions';
import { PartnerAccountRepository } from './partner-account.repository';

describe('PartnerAccountRepository', () => {
  let repository: PartnerAccountRepository;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerAccountRepository],
    }).compile();

    repository = module.get<PartnerAccountRepository>(PartnerAccountRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    const email = 'email@value.fr';

    it('should call findOne function of the repository', async () => {
      // Given
      repository.findOne = jest.fn();
      const request = { where: { email } };

      // When
      await repository.findByEmail(email);

      // Then
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith(request);
    });

    it('should throw if connection to database fails', async () => {
      // Given
      const errorMock = new Error('New Error');
      repository.findOne = jest.fn().mockRejectedValueOnce(errorMock);

      // When / Then
      await expect(repository.findByEmail(email)).rejects.toThrowError(
        PostgresConnectionFailure,
      );
    });

    it('should return the found user', async () => {
      // Given
      const user: Account = {
        id: 'idValue',
        firstname: 'firstnameValue',
        lastname: 'lastnameValue',
        password: 'passwordValue',
        email: 'email@value.fr',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };
      repository.findOne = jest.fn().mockResolvedValueOnce(user);

      // When
      const result = await repository.findByEmail(email);

      // Then
      expect(result).toStrictEqual(user);
    });
  });
});
