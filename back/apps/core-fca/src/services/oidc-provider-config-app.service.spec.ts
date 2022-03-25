import { KoaContextWithOIDC } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { OidcProviderConfigAppService } from './oidc-provider-config-app.service';

describe('OidcProviderConfigAppService', () => {
  let service: OidcProviderConfigAppService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OidcProviderConfigAppService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<OidcProviderConfigAppService>(
      OidcProviderConfigAppService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logoutSource', () => {
    let setMock;

    const ctx = {
      request: {
        method: 'POST',
        url: 'https://url.com',
      },
      response: {
        status: 200,
        message: 'OK',
      },
      req: 'toto',
    } as unknown as KoaContextWithOIDC;
    const form =
      '<form id="logoutId" method="post" action="https://redirect/me/there"><input type="hidden" name="xsrf" value="123456azerty"/></form>';

    beforeEach(() => {
      setMock = jest.fn().mockReturnValue('i am set');
      jest.spyOn(SessionService, 'getBoundedSession').mockReturnValue({
        get: jest.fn(),
        set: setMock,
      });
    });

    it('should get oidcCLientSession bounded session', () => {
      // GIVEN
      const sessionModuleName = 'OidcClient';

      // WHEN
      service.logoutSource(ctx, form);

      // THEN
      expect(SessionService.getBoundedSession).toHaveBeenCalledTimes(1);
      expect(SessionService.getBoundedSession).toHaveBeenCalledWith(
        ctx.req,
        sessionModuleName,
      );
    });

    it('should save oidc logout confirmation form within oidc client session', async () => {
      // GIVEN
      const logoutFormProperty = 'oidcProviderLogoutForm';

      // WHEN
      service.logoutSource(ctx, form);

      // THEN
      expect(setMock).toHaveBeenCalledTimes(1);
      expect(setMock).toHaveBeenCalledWith(logoutFormProperty, form);
    });

    it('should set a body property to koa context', async () => {
      // GIVEN
      const htmlDisconnectFromFi = `<!DOCTYPE html>
        <head>
          <title>Déconnexion du FI</title>
        </head>
        <body>
          <form method="POST" action="/api/v2/client/disconnect-from-idp">
          </form>
          <script>
            var form = document.forms[0];
            form.submit();
          </script>
        </body>
        </html>`;

      // WHEN
      service.logoutSource(ctx, form);

      // THEN
      expect(ctx).toHaveProperty('body', htmlDisconnectFromFi);
    });
  });

  describe('postLogoutSuccessSource', () => {
    it('should set a body property to koa context', () => {
      // GIVEN
      const ctx = {
        request: {
          method: 'POST',
          url: 'https://url.com',
        },
        response: {
          status: 200,
          message: 'OK',
        },
        req: 'toto',
      } as unknown as KoaContextWithOIDC;

      const htmlPostLogoutSuccessSource = `<!DOCTYPE html>
        <head>
          <title>Déconnexion</title>
        </head>
        <body>
          <p>Vous êtes bien déconnecté, vous pouvez fermer votre navigateur.</p>
        </body>
        </html>`;

      // WHEN
      service.postLogoutSuccessSource(ctx);

      // THEN
      expect(ctx).toHaveProperty('body', htmlPostLogoutSuccessSource);
    });
  });
});
