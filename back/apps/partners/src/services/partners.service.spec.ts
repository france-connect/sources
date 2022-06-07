import { Test, TestingModule } from '@nestjs/testing';

import { Account } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';
import { PartnerAccountService } from '@fc/partner-account';

import { PartnersService } from './partners.service';

describe('PartnersService', () => {
  let service: PartnersService;

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  const PartnerAccountServiceMock = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnersService, LoggerService, PartnerAccountService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnerAccountService)
      .useValue(PartnerAccountServiceMock)
      .compile();

    service = module.get<PartnersService>(PartnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should setup context for logger', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('login', () => {
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

    beforeEach(() => {
      PartnerAccountServiceMock.findByEmail.mockResolvedValueOnce(userMock);
    });

    it('should call partners account service findByEmail function', async () => {
      // When
      await service.login(emailMock);

      // Then
      expect(PartnerAccountServiceMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(PartnerAccountServiceMock.findByEmail).toHaveBeenCalledWith(
        emailMock,
      );
    });

    it('should return partners account service findByEmail return value', async () => {
      // When
      const result = await service.login(emailMock);

      // Then
      expect(result).toStrictEqual({
        firstname: userMock.firstname,
        lastname: userMock.lastname,
      });
    });
  });
});
