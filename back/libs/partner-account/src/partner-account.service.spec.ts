import { Test, TestingModule } from '@nestjs/testing';

import { Account } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';

import { AccountNotFound } from './exceptions';
import { PartnerAccountService } from './partner-account.service';
import { PartnerAccountRepository } from './repositories';

describe('PartnerAccountService', () => {
  let service: PartnerAccountService;

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  const PartnerAccountRepositoryMock = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnerAccountService,
        LoggerService,
        PartnerAccountRepository,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnerAccountRepository)
      .useValue(PartnerAccountRepositoryMock)
      .compile();

    service = module.get<PartnerAccountService>(PartnerAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should setup context for logger', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('findByEmail', () => {
    const emailMock = 'email@value.fr';
    const userMock: Account = {
      id: 'idValue',
      firstname: 'firstnameValue',
      lastname: 'lastnameValue',
      password: 'passwordValue',
      email: 'email@value.fr',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    it('should call findByUsername function from partners account repository', async () => {
      // Given
      PartnerAccountRepositoryMock.findByEmail.mockResolvedValueOnce(userMock);

      // When
      await service.findByEmail(emailMock);

      // Then
      expect(PartnerAccountRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(PartnerAccountRepositoryMock.findByEmail).toHaveBeenCalledWith(
        emailMock,
      );
    });

    it('should throw AccountNotFound error if no account is found in database', async () => {
      // Given
      PartnerAccountRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);

      // action / expect
      await expect(service.findByEmail(emailMock)).rejects.toThrowError(
        AccountNotFound,
      );
    });

    it('should return user account if found in database', async () => {
      // Given
      PartnerAccountRepositoryMock.findByEmail.mockResolvedValueOnce(userMock);

      // When
      const result = await service.findByEmail(emailMock);

      // Then
      expect(result).toStrictEqual(userMock);
    });
  });
});
