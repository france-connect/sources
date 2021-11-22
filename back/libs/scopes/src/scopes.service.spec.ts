import { Test, TestingModule } from '@nestjs/testing';

import { ScopesService } from './scopes.service';

describe('ScopesService', () => {
  let service: ScopesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScopesService],
    }).compile();

    service = module.get<ScopesService>(ScopesService);
  });

  describe('mapScopesToLabel', () => {
    /**
     * @TODO #452 Quand scopes label en base de donnée, modifier ce test pour récupérer
     * les infos de la BDD
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/452
     */
    it('should return labels for scopes', async () => {
      // Setup
      const scopesParamMock = [
        'openid',
        'email',
        'address',
        'phone',
        'birthcountry',
        'birthplace',
        'birthdate',
        'given_name',
        'family_name',
        'gender',
        'preferred_username',
      ];
      const resultsMock = [
        'Adresse email',
        'Adresse postale',
        'Pays de naissance',
        'Lieu de naissance',
        'Date de naissance',
        'Prénom(s)',
        'Nom de naissance',
        'Sexe',
        "Nom d'usage",
        'Téléphone',
      ];

      // Action
      const results = await service.mapScopesToLabel(scopesParamMock);

      // Assert
      expect(results).toEqual(resultsMock);
    });

    it('should return labels for profile scope', async () => {
      // Setup
      const scopesParamMock = ['profile'];
      const resultsMock = [
        'Prénom(s)',
        'Nom de naissance',
        'Date de naissance',
        'Sexe',
        "Nom d'usage",
      ];

      // Action
      const results = await service.mapScopesToLabel(scopesParamMock);

      // Expect
      expect(results).toEqual(resultsMock);
    });

    it('should return labels for identite_pivot scope', async () => {
      // Setup
      const scopesParamMock = ['identite_pivot'];
      const resultsMock = [
        'Prénom(s)',
        'Nom de naissance',
        'Date de naissance',
        'Sexe',
        'Lieu de naissance',
        'Pays de naissance',
      ];

      // Action
      const results = await service.mapScopesToLabel(scopesParamMock);

      // Expect
      expect(results).toEqual(resultsMock);
    });

    it('should return labels for birth scope', async () => {
      // Setup
      const scopesParamMock = ['birth'];
      const resultsMock = ['Lieu de naissance', 'Pays de naissance'];

      // Action
      const results = await service.mapScopesToLabel(scopesParamMock);

      // Expect
      expect(results).toEqual(resultsMock);
    });

    it("should return scope if scope label doesn't exist", async () => {
      // Setup
      const scopesParamMock = ['foo'];
      const resultsMock = ['foo'];

      // Expect
      const results = await service.mapScopesToLabel(scopesParamMock);

      // Assert
      expect(results).toEqual(resultsMock);
    });

    it('should return empty labels if array is empty', async () => {
      // Setup
      const scopesParamMock = [];
      const resultsMock = [];

      // Expect
      const results = await service.mapScopesToLabel(scopesParamMock);

      // Assert
      expect(results).toEqual(resultsMock);
    });

    it('should return empty label if array is undefined', async () => {
      // Setup
      const scopesParamMock = undefined;
      const resultsMock = [];

      // Action
      const results = await service.mapScopesToLabel(scopesParamMock);

      // Expect
      expect(results).toEqual(resultsMock);
    });

    it('should return labels if scopes are string not array', async () => {
      // Setup
      const scopesParamMock = 'openid gender family_name' as any;
      const errorMessage = 'Scopes must be Array and not string';

      try {
        // Action
        await service.mapScopesToLabel(scopesParamMock);
      } catch (error) {
        // Expect
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual(errorMessage);
      }
    });

    it('should return no void labels for scopes with openid, given_name and profile', async () => {
      // Setup
      const queryMock = ['openid', 'given_name', 'profile'];
      const resultsMock = [
        'Prénom(s)',
        'Nom de naissance',
        'Date de naissance',
        'Sexe',
        "Nom d'usage",
      ];

      // Action
      const results = await service.mapScopesToLabel(queryMock);

      // Expect
      expect(results).toEqual(resultsMock);
    });

    describe('(duplicate)', () => {
      it('should return labels once for duplicate scopes', async () => {
        // Arrange
        const queryMock = ['gender', 'gender', 'gender'];
        const resultsMock = ['Sexe'];

        // Action
        const results = await service.mapScopesToLabel(queryMock);

        // Assert
        expect(results).toEqual(resultsMock);
      });

      it('should return labels once for duplicate scopes with profile', async () => {
        // Arrange
        const queryMock = ['gender', 'profile'];
        const resultsMock = [
          'Sexe',
          'Prénom(s)',
          'Nom de naissance',
          'Date de naissance',
          "Nom d'usage",
        ];

        // Action
        const results = await service.mapScopesToLabel(queryMock);

        // Assert
        expect(results).toEqual(resultsMock);
      });
    });
  });

  describe('getClaimsFromScopes', () => {
    it('should return mapped claims for scope', () => {
      // Given
      const scopesMock = ['openid', 'phone'];
      // When
      const result = service.getClaimsFromScopes(scopesMock);
      // Then
      expect(result).toEqual(['sub', 'phone_number']);
    });

    it('should return given input if key is not in map', () => {
      // Given
      const scopesMock = ['openid', 'phone', 'foo'];
      // When
      const result = service.getClaimsFromScopes(scopesMock);
      // Then
      expect(result).toEqual(['sub', 'phone_number', 'foo']);
    });
  });
});
