import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { MockDataProviderService } from './mock-data-provider.service';

describe('MockDataProviderService', () => {
  let service: MockDataProviderService;

  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MockDataProviderService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<MockDataProviderService>(MockDataProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticateServiceProvider', () => {
    it('should throw an error if the secret is invalid', () => {
      // Given
      const apiAuthSecretMock = 'secret';
      configServiceMock.get.mockReturnValue({
        apiAuthSecret: apiAuthSecretMock,
      });

      // When / Then
      expect(() => {
        service.authenticateServiceProvider('invalid');
      }).toThrowError('Invalid credentials');
    });

    it('should not throw an error if the secret is valid', () => {
      // Given
      const apiAuthSecretMock = 'secret';
      configServiceMock.get.mockReturnValue({
        apiAuthSecret: apiAuthSecretMock,
      });

      // When / Then
      expect(() => {
        service.authenticateServiceProvider(apiAuthSecretMock);
      }).not.toThrow();
    });
  });
});
