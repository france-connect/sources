import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CoreFcpDefaultAuthorizationHandler } from './core-fcp-default-authorization.handler';

describe('CoreFcpDefaultAuthorizationHandler', () => {
  let service: CoreFcpDefaultAuthorizationHandler;

  const loggerServiceMock = getLoggerMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreFcpDefaultAuthorizationHandler, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<CoreFcpDefaultAuthorizationHandler>(
      CoreFcpDefaultAuthorizationHandler,
    );

    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('handle()', () => {
    const params = {
      state: 'state',
      scope: 'scope',
      acr_values: 'acr',
      nonce: 'nonce',
      sp_id: 'spId',
      login_hint: 'test@example.com',
    };

    it('should returns given parameters', async () => {
      // When
      const result = await service.handle(params);

      // Then
      expect(result).toStrictEqual(params);
    });
  });
});
