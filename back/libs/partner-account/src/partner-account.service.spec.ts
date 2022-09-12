import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';

import { AccountNotFound } from './exceptions';
import { PartnerAccountService } from './partner-account.service';

describe('PartnerAccountService', () => {
  let service: PartnerAccountService;

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  const PartnerAccountRepositoryMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Account])],
      providers: [PartnerAccountService, LoggerService, Repository<Account>],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(getRepositoryToken(Account))
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
      accountServiceProviders: expect.any(Array),
    };

    it('should call findByUsername function from partners account repository', async () => {
      // Given
      PartnerAccountRepositoryMock.findOne.mockResolvedValueOnce(userMock);

      // When
      await service.findByEmail(emailMock);

      // Then
      expect(PartnerAccountRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(PartnerAccountRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: emailMock },
      });
    });

    it('should throw AccountNotFound error if no account is found in database', async () => {
      // Given
      PartnerAccountRepositoryMock.findOne.mockResolvedValueOnce(undefined);

      // action / expect
      await expect(service.findByEmail(emailMock)).rejects.toThrowError(
        AccountNotFound,
      );
    });

    it('should return user account if found in database', async () => {
      // Given
      PartnerAccountRepositoryMock.findOne.mockResolvedValueOnce(userMock);

      // When
      const result = await service.findByEmail(emailMock);

      // Then
      expect(result).toStrictEqual(userMock);
    });
  });
});
