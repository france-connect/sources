import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { OidcAcrService } from './oidc-acr.service';

describe('OidcAcrService', () => {
  let service: OidcAcrService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const acrLevelsMock = {
    eidas1: 1,
    eidas2: 2,
    eidas3: 3,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OidcAcrService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<OidcAcrService>(OidcAcrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    configServiceMock.get.mockReturnValueOnce({
      acrLevels: acrLevelsMock,
    });
  });

  describe('getKnownAcrValues', () => {
    it('should return an array of known ACR values', () => {
      // Given
      const expectedKnownAcr = ['eidas1', 'eidas2', 'eidas3'];

      // when
      const result = service.getKnownAcrValues();

      // Then
      expect(result).toEqual(expectedKnownAcr);
    });
  });

  describe('isAcrValid', () => {
    it('should throw if received is lower than requested (1 vs 2)', () => {
      // Given
      const received = 'eidas1';
      const requested = 'eidas2';
      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should throw if received is lower than requested (2 vs 3)', () => {
      // Given
      const received = 'eidas2';
      const requested = 'eidas3';
      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should succeed if received is equal to requested for level eidas1', () => {
      // Given
      const received = 'eidas1';
      const requested = 'eidas1';
      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is equal to requested for level eidas2', () => {
      // Given
      const received = 'eidas2';
      const requested = 'eidas2';
      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is equal to requested for level eidas3', () => {
      // Given
      const received = 'eidas3';
      const requested = 'eidas3';
      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is higher then requested (2 vs 1)', () => {
      // Given
      const received = 'eidas2';
      const requested = 'eidas1';
      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is higher then requested (3 vs 2)', () => {
      // Given
      const received = 'eidas3';
      const requested = 'eidas2';
      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(true);
    });
  });
});
