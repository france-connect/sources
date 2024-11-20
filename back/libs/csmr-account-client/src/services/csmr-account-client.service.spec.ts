import { lastValueFrom } from 'rxjs';

import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { AccountProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';

import { CsmrAccountResponseException } from '../exceptions';
import { CsmrAccountClientService } from './csmr-account-client.service';

jest.mock('rxjs');

describe('CsmrAccountClientService', () => {
  let service: CsmrAccountClientService;

  const lastValueFromMock = jest.mocked(lastValueFrom);

  const configDataMock = {
    requestTimeout: 200,
  };

  const configMock = {
    get: jest.fn(),
  };

  const cryptographyFcpMock = {
    computeIdentityHash: jest.fn(),
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
        CsmrAccountClientService,
        ConfigService,
        {
          provide: 'AccountHighBroker',
          useValue: brokerMockHigh,
        },
        {
          provide: 'AccountLegacyBroker',
          useValue: brokerMockLegacy,
        },
        CryptographyFcpService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpMock)
      .compile();

    service = module.get<CsmrAccountClientService>(CsmrAccountClientService);

    configMock.get.mockReturnValue(configDataMock);

    brokerMockHigh.send.mockReturnValue(messageMock);
    brokerMockLegacy.send.mockReturnValue(messageMock);

    messageMock.pipe.mockReturnValue(pipeMock);
    lastValueFromMock.mockResolvedValue(brokerResponseMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccountIdsFromIdentity', () => {
    const identityMock = {} as unknown as IOidcIdentity;
    const identityHashMock = 'identityHashMock';
    const accountIdLegacyMock = 'accountIdLegacyMock';
    const accountIdHighMock = 'accountIdHighMock';

    beforeEach(() => {
      service['getAccountId'] = jest.fn();
      cryptographyFcpMock.computeIdentityHash.mockReturnValue(identityHashMock);
    });

    it('should call cryptographyFcpMock.computeIdentityHash() with identity', async () => {
      // When
      await service.getAccountIdsFromIdentity(identityMock);

      // Then
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledTimes(1);
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('should retrieves the accountId of the current user for fc legacy', async () => {
      // Given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock)
        .mockResolvedValueOnce(accountIdHighMock);

      // When
      await service.getAccountIdsFromIdentity(identityMock);

      // Then
      expect(service['getAccountId']).toHaveBeenCalledTimes(2);
      expect(service['getAccountId']).toHaveBeenNthCalledWith(
        1,
        brokerMockLegacy,
        'AccountLegacyBroker',
        identityHashMock,
      );
    });

    it('should retrieves the accountId of the current user for fcp high', async () => {
      // Given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock)
        .mockResolvedValueOnce(accountIdHighMock);

      // When
      await service.getAccountIdsFromIdentity(identityMock);

      // Then
      expect(service['getAccountId']).toHaveBeenCalledTimes(2);
      expect(service['getAccountId']).toHaveBeenNthCalledWith(
        2,
        brokerMockHigh,
        'AccountHighBroker',
        identityHashMock,
      );
    });

    it('should return all accounts id if defined', async () => {
      // Given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock)
        .mockResolvedValueOnce(accountIdHighMock);

      // When
      const result = await service.getAccountIdsFromIdentity(identityMock);

      // Then
      expect(result).toStrictEqual([accountIdLegacyMock, accountIdHighMock]);
    });

    it('should return only the account ids that are defined', async () => {
      // Given
      jest
        .mocked(service['getAccountId'])
        .mockResolvedValueOnce(accountIdLegacyMock);

      // When
      const result = await service.getAccountIdsFromIdentity(identityMock);

      // Then
      expect(result).toStrictEqual([accountIdLegacyMock]);
    });
  });

  describe('getAccountId', () => {
    const identityHashMock = '123-456-789';
    const castedBrokerMock = brokerMockHigh as unknown as ClientProxy;

    it('should send a message using the identityHash to return the accountId', async () => {
      // When
      await service['getAccountId'](
        castedBrokerMock,
        'AccountHighBroker',
        identityHashMock,
      );

      // Then
      expect(brokerMockHigh.send).toHaveBeenCalledTimes(1);
      expect(brokerMockHigh.send).toHaveBeenCalledWith(
        AccountProtocol.Commands.GET_ACCOUNT_ID,
        {
          identityHash: identityHashMock,
        },
      );
    });

    it('should return the accountId', async () => {
      // When
      const result = await service['getAccountId'](
        castedBrokerMock,
        'AccountHighBroker',
        identityHashMock,
      );

      // Then
      expect(result).toBe(brokerResponseMock.payload);
    });

    it('should throw if consumer returns `ERROR`', async () => {
      // Given
      const errorToken = 'ERROR';
      lastValueFromMock.mockResolvedValue(errorToken);

      // When / Then
      await expect(() =>
        service['getAccountId'](
          castedBrokerMock,
          'AccountHighBroker',
          identityHashMock,
        ),
      ).rejects.toThrow(CsmrAccountResponseException);
    });

    it('should throw if consumer throws', async () => {
      // Given
      lastValueFromMock.mockImplementationOnce(() => {
        throw new Error('some error');
      });

      // When / Then
      await expect(() =>
        service['getAccountId'](
          castedBrokerMock,
          'AccountHighBroker',
          identityHashMock,
        ),
      ).rejects.toThrow(CsmrAccountResponseException);
    });
  });
});
