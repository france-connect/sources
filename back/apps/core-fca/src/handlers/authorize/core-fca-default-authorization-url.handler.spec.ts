import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { OidcClientService } from '@fc/oidc-client';

import { getLoggerMock } from '@mocks/logger';

import { AuthorizeParamsKeys } from '../../enums';
import { CoreFcaDefaultAuthorizationHandler } from './';

describe('CoreFcaDefaultAuthorizationHandler', () => {
  let service: CoreFcaDefaultAuthorizationHandler;

  const loggerServiceMock = getLoggerMock();

  const oidClientMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
    },
  };

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
    it('should call getAuthorizeUrl() with correct params', async () => {
      const expectedParams = {
        state: 'state',
        scope: 'scope',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        claims: '{"id_token":{"amr":{"essential":true}}}',
        // oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: 'test@example.com',
      };

      const expectedAuthorizeUrl = 'prefix/authorize';
      oidClientMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        expectedAuthorizeUrl,
      );

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
        // oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: 'test@example.com',
      };

      await service.handle(params);

      expect(oidClientMock.utils.getAuthorizeUrl).toBeCalledTimes(1);
      expect(oidClientMock.utils.getAuthorizeUrl).toBeCalledWith(
        expectedParams,
      );
    });

    it('should call handle() returning an authorization url with sp_id', async () => {
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

      const expectedAuthorizeUrl = 'prefix/authorize';
      oidClientMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        expectedAuthorizeUrl,
      );
      const result = await service.handle(params);

      expect(result).toStrictEqual('prefix/authorize&sp_id=spId');
    });
  });

  describe('getAuthorizeParams()', () => {
    it('should return params required for retrieving authorization url', () => {
      const params = {
        state: 'state',
        scope: 'scope',
        idpId: 'idpId',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr_values',
        nonce: 'nonce',
      };

      const expected = {
        ...params,
        // oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: undefined,
        claims: '{"id_token":{"amr":{"essential":true}}}',
      };
      const result = service['getAuthorizeParams'](params);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('appendParamToAuthorizeUrl()', () => {
    it('should return an url with selected parameter appended', () => {
      const serviceProviderId = 'serviceProviderId';
      const authorizationUrl = '/authorization-url.com';
      const completeUrl = service['appendParamToAuthorizeUrl'](
        AuthorizeParamsKeys.SP_ID,
        serviceProviderId,
        authorizationUrl,
      );
      expect(completeUrl).toStrictEqual(
        `${authorizationUrl}&sp_id=${serviceProviderId}`,
      );
    });
  });
});
