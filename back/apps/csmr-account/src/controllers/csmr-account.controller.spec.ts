import { Test, TestingModule } from '@nestjs/testing';

import { AccountService } from '@fc/account';
import { LoggerService } from '@fc/logger';
import { AccountProtocol } from '@fc/microservices';

import { getLoggerMock } from '@mocks/logger';

import { CsmrAccountController } from './csmr-account.controller';

describe('CsmrAccountController', () => {
  let controller: CsmrAccountController;

  const loggerMock = getLoggerMock();

  const accountServiceMock = {
    getAccountByIdentityHash: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrAccountController],
      providers: [LoggerService, AccountService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .compile();

    controller = app.get<CsmrAccountController>(CsmrAccountController);
  });

  describe('getAccountId', () => {
    it('should call accountService.getAccountByIdentityHash', async () => {
      // Given
      const payloadMock = {
        identityHash: 'identityHashValue',
      };
      // When
      await controller.getAccountId(payloadMock);
      // Then
      expect(accountServiceMock.getAccountByIdentityHash).toHaveBeenCalledTimes(
        1,
      );
      expect(accountServiceMock.getAccountByIdentityHash).toHaveBeenCalledWith(
        payloadMock.identityHash,
      );
    });

    it('should return the a FSA object with the id from the object returned by accountService.getAccountByIdentityHash', async () => {
      // Given
      const payloadMock = {
        identityHash: 'identityHashValue',
      };

      const accountMock = {
        id: Symbol('AccountMockId'),
      };

      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountMock,
      );

      const expectedResult = {
        type: AccountProtocol.Commands.GET_ACCOUNT_ID,
        payload: accountMock.id,
      };

      // When
      const result = await controller.getAccountId(payloadMock);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should call logger.err', async () => {
      // Given
      const payloadMock = {
        identityHash: 'identityHashValue',
      };

      const errorMock = new Error('some error');
      accountServiceMock.getAccountByIdentityHash.mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      await controller.getAccountId(payloadMock);

      // Then
      expect(loggerMock.err).toHaveBeenCalledTimes(1);
    });

    it('should return the `ERROR` token', async () => {
      // Given
      const payloadMock = {
        identityHash: 'identityHashValue',
      };

      const errorMock = new Error('some error');
      accountServiceMock.getAccountByIdentityHash.mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      const result = await controller.getAccountId(payloadMock);

      // Then
      expect(result).toBe('ERROR');
    });
  });
});
