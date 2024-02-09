import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { OidcClientService } from '@fc/oidc-client';

import { getLoggerMock } from '@mocks/logger';

import { CoreFcaMcpAuthorizationHandler } from './';

describe('CoreFcaMcpAuthorizationHandler', () => {
  let service: CoreFcaMcpAuthorizationHandler;

  const loggerServiceMock = getLoggerMock();

  const oidClientMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
    },
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

  describe('getAuthorizeParams', () => {
    it('should call getAuthorizeUrl() with correct params', async () => {
      const params = {
        oidcClient: oidClientMock as unknown as OidcClientService,
        state: 'state',
        scope: 'scope',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        spId: 'spId',
      };

      const expectedParams = {
        state: 'state',
        scope: 'scope is_service_public',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        claims: '{"id_token":{"amr":{"essential":true}}}',
      };

      const expectedAuthorizeUrl = 'prefix/authorize';
      oidClientMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        expectedAuthorizeUrl,
      );

      await service.handle(params);

      expect(oidClientMock.utils.getAuthorizeUrl).toBeCalledTimes(1);
      expect(oidClientMock.utils.getAuthorizeUrl).toBeCalledWith(
        expectedParams,
      );
    });

    it('should call handle() returning an authorization url with sp_id and adding is_service_public in scope', async () => {
      const params = {
        oidcClient: oidClientMock as unknown as OidcClientService,
        state: 'state',
        scope: 'scope',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        spId: 'spId',
      };

      const expectedParams = {
        state: 'state',
        scope: 'scope is_service_public',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        claims: '{"id_token":{"amr":{"essential":true}}}',
      };

      const expectedAuthorizeUrl = 'prefix/authorize';
      oidClientMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        expectedAuthorizeUrl,
      );
      const result = await service.handle(params);

      expect(oidClientMock.utils.getAuthorizeUrl).toBeCalledTimes(1);
      expect(oidClientMock.utils.getAuthorizeUrl).toBeCalledWith(
        expectedParams,
      );
      expect(result).toBe('prefix/authorize&sp_id=spId');
    });

    it('should call handle() returning an authorization url with sp_id and not adding again is_service_public in scope', async () => {
      const params = {
        oidcClient: oidClientMock as unknown as OidcClientService,
        state: 'state',
        scope: 'is_service_public',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        spId: 'spId',
      };

      const expectedAuthorizeUrl = 'prefix/authorize';
      oidClientMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        expectedAuthorizeUrl,
      );
      const result = await service.handle(params);
      expect(result).toBe('prefix/authorize&sp_id=spId');
    });
  });

  describe('handleScopePublicness', () => {
    it('should add  is_service_public', () => {
      const result = service['handleScopePublicness']('other_scope');
      expect(result).toStrictEqual('other_scope is_service_public');
    });

    it('should not add  is_service_public', () => {
      const result = service['handleScopePublicness'](
        'other_scope is_service_public',
      );
      expect(result).toStrictEqual('other_scope is_service_public');
    });
  });
});
