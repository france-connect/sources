import { Test, TestingModule } from '@nestjs/testing';

import { Account } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';
import { PartnerAccountService } from '@fc/partner-account';
import { PartnerServiceProviderService } from '@fc/partner-service-provider';

import { PartnersService } from './partners.service';

describe('PartnersService', () => {
  let service: PartnersService;

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  const PartnerAccountServiceMock = {
    findByEmail: jest.fn(),
  };

  const partnerServiceProviderServiceMock = {
    getServiceProvidersListByAccount: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        LoggerService,
        PartnerAccountService,
        PartnerServiceProviderService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnerAccountService)
      .useValue(PartnerAccountServiceMock)
      .overrideProvider(PartnerServiceProviderService)
      .useValue(partnerServiceProviderServiceMock)
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
      accountServiceProviders: expect.any(Array),
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
        id: userMock.id,
        email: userMock.email,
        firstname: userMock.firstname,
        lastname: userMock.lastname,
        createdAt: userMock.createdAt,
        updatedAt: userMock.updatedAt,
      });
    });
  });

  describe('getServiceProvidersByAccount', () => {
    const accountId = '123';
    const offset = 0;
    const limit = 10;

    const createdAt = new Date();
    const updatedAt = new Date();

    it('should return a service provider list for FCP', async () => {
      // given
      const expected = {
        meta: { totalItems: 1 },
        payload: [
          {
            id: 'd7d36b81-0b68-4c26-a399-854848164f29',
            name: 'Service Provider - Sandbox',
            status: 'SANDBOX',
            createdAt,
            updatedAt,
            organisation: {
              name: 'Direction Interministerielle du Numérique',
            },
            platform: {
              name: 'FRANCE_CONNECT_LOW',
            },
            datapass: [
              {
                remoteId: '765',
              },
            ],
          },
        ],
      };

      partnerServiceProviderServiceMock.getServiceProvidersListByAccount.mockResolvedValueOnce(
        {
          totalItems: 1,
          items: [
            {
              id: 'd7d36b81-0b68-4c26-a399-854848164f29',
              name: 'Service Provider - Sandbox',
              status: 'SANDBOX',
              createdAt,
              updatedAt,
              organisation: {
                name: 'Direction Interministerielle du Numérique',
              },
              platform: {
                name: 'FRANCE_CONNECT_LOW',
              },
              datapass: [
                {
                  remoteId: '765',
                },
              ],
            },
          ],
        },
      );

      // when
      const result = await service.getServiceProvidersByAccount(
        accountId,
        offset,
        limit,
      );
      // then
      expect(result).toStrictEqual(expected);
    });
  });
});
