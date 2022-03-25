import { KoaContextWithOIDC } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

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

    it('should set a body property to koa context', async () => {
      // GIVEN
      const htmlDisconnectFromFi = `<!DOCTYPE html>
        <head>
          <title>Déconnexion</title>
        </head>
        <body>
          ${form}
          <script>
            var form = document.forms[0];
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'logout';
            input.value = 'yes';
            form.appendChild(input);
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
