import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { OidcSession } from '@fc/oidc';

import { getConfigMock } from '@mocks/config';

import { OidcAcrNoSsoAllowedAcrFoundException } from './exceptions';
import { OidcAcrService } from './oidc-acr.service';

describe('OidcAcrService', () => {
  let service: OidcAcrService;

  const configServiceMock = getConfigMock();

  const knownAcrValuesMock = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
  };

  const allowedAcrValuesMock = ['B', 'C'];

  const allowedSsoAcrsMock = ['B', 'C'];

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

    configServiceMock.get.mockReturnValue({
      knownAcrValues: knownAcrValuesMock,
      allowedAcrValues: allowedAcrValuesMock,
      allowedSsoAcrs: allowedSsoAcrsMock,
    });
  });

  describe('getKnownAcrValues', () => {
    it('should return an array of known ACR values', () => {
      // Given
      const expectedKnownAcr = ['A', 'B', 'C', 'D', 'E'];

      // when
      const result = service.getKnownAcrValues();

      // Then
      expect(result).toEqual(expectedKnownAcr);
    });
  });

  describe('isAcrValid', () => {
    it('should throw if received is lower than requested (1 vs 2)', () => {
      // Given
      const received = 'A';
      const requested = 'B';

      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should throw if received is lower than requested (2 vs 3)', () => {
      // Given
      const received = 'B';
      const requested = 'C';

      // When
      const result = service.isAcrValid(received, requested);
      // Then
      expect(result).toStrictEqual(false);
    });

    it('should succeed if received is equal to requested for level A', () => {
      // Given
      const received = 'A';
      const requested = 'A';

      // When
      const result = service.isAcrValid(received, requested);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is equal to requested for level B', () => {
      // Given
      const received = 'B';
      const requested = 'B';

      // When
      const result = service.isAcrValid(received, requested);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is equal to requested for level C', () => {
      // Given
      const received = 'C';
      const requested = 'C';

      // When
      const result = service.isAcrValid(received, requested);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is higher then requested (2 vs 1)', () => {
      // Given
      const received = 'B';
      const requested = 'A';

      // When
      const result = service.isAcrValid(received, requested);

      // Then
      expect(result).toStrictEqual(true);
    });

    it('should succeed if received is higher then requested (3 vs 2)', () => {
      // Given
      const received = 'C';
      const requested = 'B';

      // When
      const result = service.isAcrValid(received, requested);

      // Then
      expect(result).toStrictEqual(true);
    });
  });

  describe('getInteractionAcr()', () => {
    it('should return the idpAcr value', () => {
      // Given
      const sessionDataMock: OidcSession = {
        spAcr: 'B',
        idpAcr: 'C',
      };

      // When
      const result = service['getInteractionAcr'](sessionDataMock);

      // Then
      expect(result).toBe('C');
    });

    it('should return the spAcr value', () => {
      // Given
      const sessionDataMock: OidcSession = {
        spAcr: 'B',
        idpAcr: 'D',
      };

      // When
      const result = service['getInteractionAcr'](sessionDataMock);

      // Then
      expect(result).toBe('B');
    });

    it('should return the first allowed acr value', () => {
      // Given
      const sessionDataMock: OidcSession = {
        spAcr: 'A',
        idpAcr: 'D',
        isSso: true,
      };

      const downgradedAcr = Symbol('downgradedAcr');

      service['getFirstAllowedAcr'] = jest.fn().mockReturnValue(downgradedAcr);

      // When
      const result = service['getInteractionAcr'](sessionDataMock);

      // Then
      expect(result).toBe(downgradedAcr);
    });
  });

  describe('getAcrToAskToIdp', () => {
    // @note We do not mock getMinAcr() as it keeps the test simpler

    it('should return the sp acr value when it is higher than minimal idp acr', () => {
      // Given
      const spAcr = 'B';
      const idpAllowedAcr = ['A', 'B', 'C'];

      // When
      const result = service.getAcrToAskToIdp(spAcr, idpAllowedAcr);

      // Then
      expect(result).toBe('B');
    });

    it('should return the minimal idp acr value when it is higher than sp acr', () => {
      // Given
      const spAcr = 'A';
      const idpAllowedAcr = ['B', 'C'];

      // When
      const result = service.getAcrToAskToIdp(spAcr, idpAllowedAcr);

      // Then
      expect(result).toBe('B');
    });

    it('should return the sp acr value even if the idp does not reach the sp acr', () => {
      // Given
      const spAcr = 'C';
      const idpAllowedAcr = ['A', 'B'];

      // When
      const result = service.getAcrToAskToIdp(spAcr, idpAllowedAcr);

      // Then
      expect(result).toBe('C');
    });
  });

  describe('getMinAcr', () => {
    it('should return the minimum acr value', () => {
      // Given
      const acrList = ['A', 'B', 'C'];

      const sortedListMock = ['a', 'b', 'c'];
      service['getSortedAcrList'] = jest.fn().mockReturnValue(sortedListMock);

      // When
      const result = service['getMinAcr'](acrList);

      // Then
      expect(result).toBe('a');
    });
  });

  describe('getMaxAcr', () => {
    it('should return the maximum acr value', () => {
      // Given
      const acrList = ['A', 'B', 'C'];

      const sortedListMock = ['a', 'b', 'c'];
      service['getSortedAcrList'] = jest.fn().mockReturnValue(sortedListMock);

      // When
      const result = service['getMaxAcr'](acrList);

      // Then
      expect(result).toBe('c');
    });
  });

  describe('getSortedAcrList', () => {
    const expectedResult = ['A', 'B', 'C'];

    const inputs = [
      ['A', 'B', 'C'],
      ['A', 'C', 'B'],
      ['B', 'A', 'C'],
      ['B', 'C', 'A'],
      ['C', 'A', 'B'],
      ['C', 'B', 'A'],
    ];

    it.each(inputs)(
      'should return the sorted acr list for input %s, %s, %s',
      (...acrList) => {
        // When
        const result = service['getSortedAcrList'](acrList);

        // Then
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('getFirstAllowedAcr', () => {
    it('should return first allowed acr bellow current (E > C)', () => {
      // Given
      const currentAcr = 'E';

      // When
      const result = service['getFirstAllowedAcr'](currentAcr);

      // Then
      expect(result).toBe('C');
    });

    it('should return first allowed acr bellow current (D > C)', () => {
      // Given
      const currentAcr = 'D';

      // When
      const result = service['getFirstAllowedAcr'](currentAcr);

      // Then
      expect(result).toBe('C');
    });

    it('should return current acr (C)', () => {
      // Given
      const currentAcr = 'C';

      // When
      const result = service['getFirstAllowedAcr'](currentAcr);

      // Then
      expect(result).toBe('C');
    });

    it('should return current acr (B)', () => {
      // Given
      const currentAcr = 'B';

      // When
      const result = service['getFirstAllowedAcr'](currentAcr);

      // Then
      expect(result).toBe('B');
    });

    it('should throw if current and bellow acrs are not allowed to perform SSO (A)', () => {
      // Given
      const currentAcr = 'A';

      // Then / When
      expect(() => service['getFirstAllowedAcr'](currentAcr)).toThrow(
        OidcAcrNoSsoAllowedAcrFoundException,
      );
    });
  });
});
