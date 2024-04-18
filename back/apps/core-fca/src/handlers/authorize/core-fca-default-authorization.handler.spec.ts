import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CoreFcaDefaultAuthorizationHandler } from './core-fca-default-authorization.handler';

describe('CoreFcaDefaultAuthorizationHandler', () => {
  let service: CoreFcaDefaultAuthorizationHandler;

  const loggerServiceMock = getLoggerMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreFcaDefaultAuthorizationHandler, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<CoreFcaDefaultAuthorizationHandler>(
      CoreFcaDefaultAuthorizationHandler,
    );

    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('handle()', () => {
    const params = {
      state: 'state',
      scope: 'scope',
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acr',
      nonce: 'nonce',
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sp_id: 'spId',
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint: 'test@example.com',
    };

    it('should add "claims" parameter to authorization parameters', async () => {
      // Given
      const expectedParams = {
        state: 'state',
        scope: 'scope',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        claims: { id_token: { amr: { essential: true } } },
        // oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        sp_id: 'spId',
        // oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: 'test@example.com',
      };

      // When
      const result = await service.handle(params);

      // Then
      expect(result).toStrictEqual(expectedParams);
    });
  });
});
