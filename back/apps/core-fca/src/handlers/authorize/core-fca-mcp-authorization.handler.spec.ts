import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CoreFcaMcpAuthorizationHandler } from '.';

describe('CoreFcaMcpAuthorizationHandler', () => {
  let service: CoreFcaMcpAuthorizationHandler;

  const loggerServiceMock = getLoggerMock();

  const params = {
    state: 'state',
    scope: 'scope',
    acr_values: 'acr',
    nonce: 'nonce',
    sp_id: 'spId',
    login_hint: 'loginHint',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreFcaMcpAuthorizationHandler, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<CoreFcaMcpAuthorizationHandler>(
      CoreFcaMcpAuthorizationHandler,
    );

    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('handle', () => {
    it('should add is_service_public to the scope', async () => {
      // Given
      const expectedParams = {
        state: 'state',
        scope: 'scope is_service_public',
        acr_values: 'acr',
        nonce: 'nonce',
        claims: { id_token: { amr: { essential: true } } },
        sp_id: 'spId',
        login_hint: 'loginHint',
      };

      // When
      const result = await service.handle(params);

      // Then
      expect(result).toStrictEqual(expectedParams);
    });
  });
});
