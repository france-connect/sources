import { lastValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { AccountProtocol } from '@fc/microservices';

import { CsmrTracksAccountResponseException } from '../exceptions';
import { CsmrTracksAccountService } from './csmr-tracks-account.service';

jest.mock('rxjs');

describe('CsmrTracksAccountService', () => {
  let service: CsmrTracksAccountService;

  const lastValueFromMock = jest.mocked(lastValueFrom);

  const configDataMock = {
    requestTimeout: 200,
  };

  const configMock = {
    get: jest.fn(),
  };

  const brokerMockHigh = {
    close: jest.fn(),
    connect: jest.fn(),
    send: jest.fn(),
  };

  const brokerMockLegacy = {
    close: jest.fn(),
    connect: jest.fn(),
    send: jest.fn(),
  };

  const messageMock = {
    pipe: jest.fn(),
  };

  const pipeMock = {};
  const brokerResponseMock = {
    type: 'SOME_TYPE',
    payload: 'brokerResponseMock',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrTracksAccountService,
        ConfigService,
        {
          provide: 'AccountHighBroker',
          useValue: brokerMockHigh,
        },
        {
          provide: 'AccountLegacyBroker',
          useValue: brokerMockLegacy,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<CsmrTracksAccountService>(CsmrTracksAccountService);

    configMock.get.mockReturnValueOnce(configDataMock);

    brokerMockHigh.send.mockReturnValue(messageMock);
    brokerMockLegacy.send.mockReturnValue(messageMock);

    messageMock.pipe.mockReturnValue(pipeMock);
    lastValueFromMock.mockResolvedValue(brokerResponseMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIdsWithIdentityHash', () => {
    const identityHashMock = 'identityHashMock';
    const accountIdLegacyMock = 'accountIdLegacyMock';
    const accountIdHighMock = 'accountIdHighMock';

    beforeEach(() => {
      service['getAccountId'] = jest.fn();
    });

    it('should retrieves the accountId of the current user for fc legacy', async () => {
      // given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock)
        .mockResolvedValueOnce(accountIdHighMock);

      // when
      await service.getIdsWithIdentityHash(identityHashMock);

      // then
      expect(service['getAccountId']).toHaveBeenCalledTimes(2);
      expect(service['getAccountId']).toHaveBeenNthCalledWith(
        1,
        brokerMockLegacy,
        identityHashMock,
      );
    });

    it('should retrieves the accountId of the current user for fcp high', async () => {
      // given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock)
        .mockResolvedValueOnce(accountIdHighMock);

      // when
      await service.getIdsWithIdentityHash(identityHashMock);

      // then
      expect(service['getAccountId']).toHaveBeenCalledTimes(2);
      expect(service['getAccountId']).toHaveBeenNthCalledWith(
        2,
        brokerMockHigh,
        identityHashMock,
      );
    });

    it('should return all accounts id if defined', async () => {
      // given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock)
        .mockResolvedValueOnce(accountIdHighMock);

      // when
      const result = await service.getIdsWithIdentityHash(identityHashMock);

      // then
      expect(result).toStrictEqual([accountIdLegacyMock, accountIdHighMock]);
    });

    it('should return only the account ids that are defined', async () => {
      // given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock);

      // when
      const result = await service.getIdsWithIdentityHash(identityHashMock);

      // then
      expect(result).toStrictEqual([accountIdLegacyMock]);
    });
  });

  describe('getAccountId', () => {
    const identityHashMock = '123-456-789';
    const castedBrokerMock = brokerMockHigh as unknown as ClientProxy;

    it('should send a message using the identityHash to return the accountId', async () => {
      // when
      await service['getAccountId'](castedBrokerMock, identityHashMock);

      // then
      expect(brokerMockHigh.send).toHaveBeenCalledTimes(1);
      expect(brokerMockHigh.send).toHaveBeenCalledWith(
        AccountProtocol.Commands.GET_ACCOUNT_ID,
        {
          identityHash: identityHashMock,
        },
      );
    });

    it('should return the accountId', async () => {
      // when
      const result = await service['getAccountId'](
        castedBrokerMock,
        identityHashMock,
      );

      // then
      expect(result).toBe(brokerResponseMock.payload);
    });

    it('should throw if consumer returns `ERROR`', async () => {
      // Given
      const errorToken = 'ERROR';
      lastValueFromMock.mockResolvedValue(errorToken);

      // When / Then
      await expect(() =>
        service['getAccountId'](castedBrokerMock, identityHashMock),
      ).rejects.toThrow(CsmrTracksAccountResponseException);
    });

    it('should throw if consumer throws', async () => {
      // Given
      lastValueFromMock.mockImplementationOnce(() => {
        throw new Error('some error');
      });

      // When / Then
      await expect(() =>
        service['getAccountId'](castedBrokerMock, identityHashMock),
      ).rejects.toThrow(CsmrTracksAccountResponseException);
    });
  });
});
