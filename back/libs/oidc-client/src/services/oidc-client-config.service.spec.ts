import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerLevelNames, LoggerService } from '@fc/logger';

import { IDENTITY_PROVIDER_SERVICE } from '../tokens';
import { OidcClientConfigService } from './oidc-client-config.service';

describe('OidcClientConfigService', () => {
  let service: OidcClientConfigService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
  } as unknown as LoggerService;

  const IdentityProviderServiceMock = { getList: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        LoggerService,
        CryptographyService,
        OidcClientConfigService,
        {
          provide: IDENTITY_PROVIDER_SERVICE,
          useValue: IdentityProviderServiceMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<OidcClientConfigService>(OidcClientConfigService);

    jest.resetAllMocks();

    IdentityProviderServiceMock.getList.mockResolvedValue(
      'IdentityProviderServiceMock Resolve Value',
    );

    configServiceMock.get.mockImplementation((module: string) => {
      switch (module) {
        case 'OidcClient':
          return {
            issuer: 'http://foo.bar',
            configuration: {},
            jwks: { keys: [] },
          };
        case 'Logger':
          return {
            path: '/dev/null',
            level: LoggerLevelNames.TRACE,
            isDevelopment: false,
          };
      }
    });
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('get', () => {
    it('should call IdentityProviderServiceMock.getList() with refresh parameter', async () => {
      // When
      await service.get(true);
      // Then
      expect(IdentityProviderServiceMock.getList).toHaveBeenCalledTimes(1);
      expect(IdentityProviderServiceMock.getList).toHaveBeenCalledWith(true);
    });

    it('should call configServiceMock.get() with "OidcClient"', async () => {
      // When
      await service.get();
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcClient');
    });

    it('should return data from identity.getList', async () => {
      // When
      const result = await service.get();
      // Then
      expect(result).toHaveProperty('providers');
      expect(result.providers).toBe(
        'IdentityProviderServiceMock Resolve Value',
      );
    });
  });
});
