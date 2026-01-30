import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { AssetsService } from './assets.service';

describe('AssetsService', () => {
  let service: AssetsService;

  const configServiceMock = getConfigMock();

  const assetsUrlPrefix = '/prefix/token';
  const assetsUrlDomain = 'example.com';
  const configDataMock = {
    assetsUrlPrefix,
    assetsUrlDomain,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<AssetsService>(AssetsService);

    configServiceMock.get.mockReturnValue(configDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAssetFullPath', () => {
    it('should return the relative path of an asset with the assetsUrlPrefix when there is no assetsUrlDomain', () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        assetsUrlPrefix,
      });
      const assetPath = '/assets/test.png';

      // When
      const result = service.getAssetFullPath(assetPath);

      // Then
      expect(result).toBe(`${assetsUrlPrefix}${assetPath}`);
    });

    it('should return the full path of an asset with the assetsUrlDomain and the assetsUrlPrefix', () => {
      // Given
      const assetPath = '/assets/test.png';

      // When
      const result = service.getAssetFullPath(assetPath);

      // Then
      expect(result).toBe(
        `https://${assetsUrlDomain}${assetsUrlPrefix}${assetPath}`,
      );
    });
  });
});
