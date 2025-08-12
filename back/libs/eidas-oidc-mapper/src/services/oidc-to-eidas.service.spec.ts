import { Test, TestingModule } from '@nestjs/testing';

import { CogService } from '@fc/cog';
import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasStatusCodes,
  EidasSubStatusCodes,
} from '@fc/eidas';
import { LoggerService } from '@fc/logger';
import { OidcError } from '@fc/oidc';

import { getLoggerMock } from '@mocks/logger';

import { AcrValues } from '../enums';
import { OidcToEidasService } from './oidc-to-eidas.service';

describe('OidcToEidasService', () => {
  let service: OidcToEidasService;

  const loggerServiceMock = getLoggerMock();

  const eidasCogServiceMock = {
    injectLabelsForCogs: jest.fn(),
  };

  const claimsMock = {
    birthcountry: '99100',
    birthdate: '1962-08-24',
    birthplace: '75107',
    email: 'wossewodda-3728@yopmail.com',
    family_name: 'DUBOIS',
    gender: 'female',
    given_name: 'Angela Claire Louise',

    preferred_username: 'DUMEUBLE',

    sub: 'b155a2129530e5fd3f6b95275b6da72a99ea1a486b8b33148abb4a62ddfb3609v2',
  };

  const requestedAttributesMock = [
    EidasAttributes.PERSON_IDENTIFIER,
    EidasAttributes.CURRENT_FAMILY_NAME,
    EidasAttributes.CURRENT_GIVEN_NAME,
    EidasAttributes.DATE_OF_BIRTH,
  ];

  const partialSuccessResponseMock = {
    attributes: {
      currentFamilyName: ['DUMEUBLE'],
      currentGivenName: ['Angela', 'Claire', 'Louise'],
      dateOfBirth: ['1962-08-24'],
      personIdentifier: [
        'b155a2129530e5fd3f6b95275b6da72a99ea1a486b8b33148abb4a62ddfb3609v2',
      ],
    },
    levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
    status: { failure: false, statusCode: EidasStatusCodes.SUCCESS },
    subject:
      'b155a2129530e5fd3f6b95275b6da72a99ea1a486b8b33148abb4a62ddfb3609v2',
  };

  const acrMock = AcrValues.EIDAS2;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OidcToEidasService, LoggerService, CogService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CogService)
      .useValue(eidasCogServiceMock)
      .compile();

    service = module.get<OidcToEidasService>(OidcToEidasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('mapPartialRequest', () => {
    const requestedScopesMock = 'openid given_name family_name';
    const acrMock = AcrValues.EIDAS2;
    const mapScopesToRequestedAttributesMock = jest.fn();

    const splittedScopes = requestedScopesMock.split(' ');

    beforeEach(() => {
      service['mapScopesToRequestedAttributes'] =
        mapScopesToRequestedAttributesMock;

      mapScopesToRequestedAttributesMock.mockReturnValueOnce(
        requestedAttributesMock,
      );
    });

    it('should call map the splitted oidc scopes to eidas attributes', () => {
      // When
      service.mapPartialRequest(requestedScopesMock, acrMock);

      // Then
      expect(mapScopesToRequestedAttributesMock).toHaveBeenCalledTimes(1);
      expect(mapScopesToRequestedAttributesMock).toHaveBeenCalledWith(
        splittedScopes,
      );
    });

    it('should return the eidas requested attributes and the level of assurance', () => {
      // When
      const result = service.mapPartialRequest(requestedScopesMock, acrMock);

      // Then
      expect(result).toStrictEqual({
        levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
        requestedAttributes: requestedAttributesMock,
      });
    });
  });

  describe('mapPartialResponseSuccess', () => {
    const mapRequestedAttributesFromClaimsMock = jest.fn();

    const cogMock = 'La meilleur ville du monde';
    beforeEach(() => {
      service['mapRequestedAttributesFromClaims'] =
        mapRequestedAttributesFromClaimsMock;
      mapRequestedAttributesFromClaimsMock.mockReturnValueOnce(
        partialSuccessResponseMock.attributes,
      );
      eidasCogServiceMock.injectLabelsForCogs.mockResolvedValueOnce([cogMock]);
    });

    it('should map the attributes with the claims and the requestedAttributes', async () => {
      // When
      await service.mapPartialResponseSuccess(
        claimsMock,
        acrMock,
        requestedAttributesMock,
      );

      // Then
      expect(mapRequestedAttributesFromClaimsMock).toHaveBeenCalledTimes(1);
      expect(mapRequestedAttributesFromClaimsMock).toHaveBeenCalledWith(
        claimsMock,
        requestedAttributesMock,
      );
    });

    it('should return the partial response', async () => {
      // When
      const result = await service.mapPartialResponseSuccess(
        claimsMock,
        acrMock,
        requestedAttributesMock,
      );

      // Then
      expect(result).toStrictEqual(partialSuccessResponseMock);
      expect(eidasCogServiceMock.injectLabelsForCogs).toHaveBeenCalledTimes(0);
    });

    it('should return the partial response with cogs updated', async () => {
      // Given
      const placeOfBirth = ['75011'];

      const { attributes } = partialSuccessResponseMock;

      mapRequestedAttributesFromClaimsMock.mockReset().mockReturnValueOnce({
        ...attributes,
        placeOfBirth,
      });
      const cogTransformed = {
        [EidasAttributes.PLACE_OF_BIRTH]: [cogMock],
      };
      // When
      const result = await service.mapPartialResponseSuccess(
        claimsMock,
        acrMock,
        requestedAttributesMock,
      );

      // Then
      expect(eidasCogServiceMock.injectLabelsForCogs).toHaveBeenCalledTimes(1);
      expect(eidasCogServiceMock.injectLabelsForCogs).toHaveBeenCalledWith(
        placeOfBirth,
      );
      expect(result.attributes).toHaveProperty(EidasAttributes.PLACE_OF_BIRTH);
      expect(result.attributes).toMatchObject(cogTransformed);
    });
  });

  describe('mapPartialResponseFailure', () => {
    it('should log the error as an error if error is an instance of Error', () => {
      // Given
      const error = new Error('This is an error');

      // When
      service.mapPartialResponseFailure(error);

      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.err).toHaveBeenCalledWith({
        error: 'internal_error',
        error_description:
          'FranceConnect encountered an unexpected error, please contact the support (Code Y000000).',
      });
    });

    it('should return a partial response with an "internal_error" with code Y000000 if error is an instance of Error', () => {
      // Given
      const error = new Error('This is an error');
      const partialFailureResponse = {
        status: {
          failure: true,
          statusCode: EidasStatusCodes.RESPONDER,
          statusMessage:
            '[internal_error]: FranceConnect encountered an unexpected error, please contact the support (Code Y000000).',
          subStatusCode: EidasSubStatusCodes.AUTHN_FAILED,
        },
      };

      // When
      const result = service.mapPartialResponseFailure(error);

      // Then
      expect(result).toStrictEqual(partialFailureResponse);
    });

    it('should return a partial response with an oidc error if error is an oidc error', () => {
      // Given
      const error: OidcError = {
        error: 'invalid_scope',
        error_description: 'Access denied for the scope "given_name"',
      };
      const partialFailureResponse = {
        status: {
          failure: true,
          statusCode: EidasStatusCodes.RESPONDER,
          statusMessage:
            '[invalid_scope]: Access denied for the scope "given_name"',
          subStatusCode: EidasSubStatusCodes.AUTHN_FAILED,
        },
      };

      // When
      const result = service.mapPartialResponseFailure(error);

      // Then
      expect(result).toStrictEqual(partialFailureResponse);
    });
  });

  describe('mapRequestedAttributesFromClaims', () => {
    const getClaimsBoundClaimsToAttributesReducerMock = jest.fn();
    const mockReduceResult = { mapped: 'attributes' };
    const mockReducer = () => {
      return mockReduceResult;
    };

    beforeEach(() => {
      service['getClaimsBoundClaimsToAttributesReducer'] =
        getClaimsBoundClaimsToAttributesReducerMock.mockReturnValueOnce(
          mockReducer,
        );
    });

    it('should get the reducer bound with the given claims', () => {
      // When
      service['mapRequestedAttributesFromClaims'](
        claimsMock,
        requestedAttributesMock,
      );

      // Then
      expect(getClaimsBoundClaimsToAttributesReducerMock).toHaveBeenCalledTimes(
        1,
      );
      expect(getClaimsBoundClaimsToAttributesReducerMock).toHaveBeenCalledWith(
        claimsMock,
      );
    });

    it('should return the reduce result', () => {
      // When
      const result = service['mapRequestedAttributesFromClaims'](
        claimsMock,
        requestedAttributesMock,
      );

      // Then
      expect(result).toStrictEqual(mockReduceResult);
    });
  });

  describe('getClaimsBoundClaimsToAttributesReducer', () => {
    it('should bind the OidcToEidasService and the claims to the claimsToAttributesReducer function', () => {
      // Given
      service['claimsToAttributesReducer'] = jest.fn();
      service['claimsToAttributesReducer'].bind = jest.fn();

      // When
      service['getClaimsBoundClaimsToAttributesReducer'](claimsMock);

      // Then
      expect(service['claimsToAttributesReducer'].bind).toHaveBeenCalledTimes(
        1,
      );
      expect(service['claimsToAttributesReducer'].bind).toHaveBeenCalledWith(
        OidcToEidasService,
        claimsMock,
      );
    });

    it('should return the claimsToAttributesReducer bound function', () => {
      // When
      const result =
        service['getClaimsBoundClaimsToAttributesReducer'](claimsMock);

      // Then
      expect(result).toBeInstanceOf(Function);
    });
  });

  describe('claimsToAttributesReducer', () => {
    describe('requestedAttribute is mappable', () => {
      it('should return the mapped response attribute within the given the claims and the requested attribute', () => {
        // Given
        const accumulator = {};
        const expected = { dateOfBirth: ['1962-08-24'] };

        // When
        const result = service['claimsToAttributesReducer'](
          claimsMock,
          accumulator,
          EidasAttributes.DATE_OF_BIRTH,
        );

        // Then
        expect(accumulator).toStrictEqual(expected);
        expect(result).toStrictEqual(expected);
      });
    });

    describe('requestedAttribute is not mappable', () => {
      it('should return the empty accumulatormulator object', () => {
        // Given
        const accumulator = {};
        const expected = {};

        // When
        const result = service['claimsToAttributesReducer'](
          claimsMock,
          accumulator,
          EidasAttributes.CURRENT_ADDRESS,
        );

        // Then
        expect(accumulator).toStrictEqual(expected);
        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('mapScopesToRequestedAttributes', () => {
    const oidcScopesMock = ['openid', 'given_name', 'family_name', 'birthdate'];
    const reduceMock = jest.fn();

    beforeEach(() => {
      oidcScopesMock.reduce = reduceMock;
    });

    it('should reduce the oidcScopes using scopesToRequestedAttributesReducer and a set', () => {
      // When
      service['mapScopesToRequestedAttributes'](oidcScopesMock);

      // Then
      expect(reduceMock).toHaveBeenCalledTimes(1);
      expect(reduceMock).toHaveBeenCalledWith(
        service['scopesToRequestedAttributesReducer'],
        expect.any(Set),
      );
    });

    it('should return the reduced attributes set', () => {
      // Given
      const expected = [
        EidasAttributes.PERSON_IDENTIFIER,
        EidasAttributes.CURRENT_GIVEN_NAME,
        EidasAttributes.CURRENT_FAMILY_NAME,
        EidasAttributes.DATE_OF_BIRTH,
      ];
      reduceMock.mockReturnValueOnce(expected);

      // When
      const result = service['mapScopesToRequestedAttributes'](oidcScopesMock);

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return the minimum attributes set', () => {
      // Given
      const emptyOidcScopesMock = [];
      emptyOidcScopesMock.reduce = reduceMock;

      const expected = [
        EidasAttributes.PERSON_IDENTIFIER,
        EidasAttributes.CURRENT_GIVEN_NAME,
        EidasAttributes.CURRENT_FAMILY_NAME,
        EidasAttributes.DATE_OF_BIRTH,
      ];
      reduceMock.mockReturnValueOnce(expected);

      // When
      const result =
        service['mapScopesToRequestedAttributes'](emptyOidcScopesMock);

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('scopesToRequestedAttributesReducer', () => {
    it('should add to the set requested attribute equivalent to the given oidc scope and return the set', () => {
      // Given
      const attributesSetMock = new Set<EidasAttributes>();
      const expectedSet = new Set<EidasAttributes>([
        EidasAttributes.PERSON_IDENTIFIER,
      ]);

      // When
      const result = service['scopesToRequestedAttributesReducer'](
        attributesSetMock,
        'openid',
      );

      // Then
      expect(result).toStrictEqual(expectedSet);
    });

    it('should not add anything to the set if there is no equivalent to the given scope', () => {
      // Given
      const attributesSetMock = new Set<EidasAttributes>();

      // When
      const result = service['scopesToRequestedAttributesReducer'](
        attributesSetMock,
        'What is love ?',
      );

      // Then
      expect(result).toStrictEqual(attributesSetMock);
    });
  });
});
