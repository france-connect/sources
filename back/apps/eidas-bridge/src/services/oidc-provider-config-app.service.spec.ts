import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import {
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { OidcProviderConfigAppService } from './oidc-provider-config-app.service';

describe('OidcProviderConfigAppService', () => {
  let service: OidcProviderConfigAppService;

  const sessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const errorServiceMock = {
    throwError: jest.fn(),
  };

  const oidcProviderGrantServiceMock = {
    generateGrant: jest.fn(),
    saveGrant: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();
  const configServiceMock = getConfigMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderConfigAppService,
        LoggerService,
        SessionService,
        OidcProviderErrorService,
        OidcProviderGrantService,
        ConfigService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(errorServiceMock)
      .overrideProvider(OidcProviderGrantService)
      .useValue(oidcProviderGrantServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<OidcProviderConfigAppService>(
      OidcProviderConfigAppService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
