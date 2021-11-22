import { Test, TestingModule } from '@nestjs/testing';

import { CogService } from '@fc/cog';
import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasStatusCodes,
  EidasSubStatusCodes,
} from '@fc/eidas';
import { LoggerService } from '@fc/logger';
import { AcrValues, OidcError } from '@fc/oidc';

import { OidcToEidasService } from './oidc-to-eidas.service';

describe('OidcToEidasService', () => {
  let service: OidcToEidasService;

  const loggerServiceMock = {
    debug: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const eidasCogServiceMock = {
    injectLabelsForCogs: jest.fn(),
  };

  const claimsMock = {
    birthcountry: '99100',
    birthdate: '1962-08-24',
    birthplace: '75107',
    email: 'wossewodda-3728@yopmail.com',
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'DUBOIS',
    gender: 'female',
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Angela Claire Louise',

    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

  it('should set the logger context', () => {
    // expect
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.setContext).toHaveBeenCalledWith(
      'OidcToEidasService',
    );
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

    it('should call map the splitted oidc scopes to eidas attributes', async () => {
      // action
      service.mapPartialRequest(requestedScopesMock, acrMock);

      // expect
      expect(mapScopesToRequestedAttributesMock).toHaveBeenCalledTimes(1);
      expect(mapScopesToRequestedAttributesMock).toHaveBeenCalledWith(
        splittedScopes,
      );
    });

    it('should return the eidas requested attributes and the level of assurance', async () => {
      // action
      const result = service.mapPartialRequest(requestedScopesMock, acrMock);

      // expect
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
      // action
      await service.mapPartialResponseSuccess(
        claimsMock,
        acrMock,
        requestedAttributesMock,
      );

      // expect
      expect(mapRequestedAttributesFromClaimsMock).toHaveBeenCalledTimes(1);
      expect(mapRequestedAttributesFromClaimsMock).toHaveBeenCalledWith(
        claimsMock,
        requestedAttributesMock,
      );
    });

    it('should return the partial response', async () => {
      // action
      const result = await service.mapPartialResponseSuccess(
        claimsMock,
        acrMock,
        requestedAttributesMock,
      );

      // expect
      expect(result).toStrictEqual(partialSuccessResponseMock);
      expect(eidasCogServiceMock.injectLabelsForCogs).toHaveBeenCalledTimes(0);
    });

    it('should return the partial response with cogs updated', async () => {
      // setup
      const placeOfBirth = ['75011'];

      const { attributes } = partialSuccessResponseMock;

      mapRequestedAttributesFromClaimsMock.mockReset().mockReturnValueOnce({
        ...attributes,
        placeOfBirth,
      });
      const cogTransformed = {
        [EidasAttributes.PLACE_OF_BIRTH]: [cogMock],
      };
      // action
      const result = await service.mapPartialResponseSuccess(
        claimsMock,
        acrMock,
        requestedAttributesMock,
      );

      // expect
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
      // setup
      const error = new Error('This is an error');

      // action
      service.mapPartialResponseFailure(error);

      // expect
      expect(loggerServiceMock.error).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.error).toHaveBeenCalledWith(error);
    });

    it('should return a partial response with an "internal_error" with code Y000000 if error is an instance of Error', () => {
      // setup
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

      // action
      const result = service.mapPartialResponseFailure(error);

      // expect
      expect(result).toStrictEqual(partialFailureResponse);
    });

    it('should return a partial response with an oidc error if error is an oidc error', () => {
      // setup
      const error: OidcError = {
        error: 'invalid_scope',
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
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

      // action
      const result = service.mapPartialResponseFailure(error);

      // expect
      expect(result).toStrictEqual(partialFailureResponse);
    });
  });

  describe('mapRequestedAttributesFromClaims', () => {
    const getClaimsBoundedClaimsToAttributesReducerMock = jest.fn();
    const mockReduceResult = { mapped: 'attributes' };
    const mockReducer = () => {
      return mockReduceResult;
    };

    beforeEach(() => {
      service['getClaimsBoundedClaimsToAttributesReducer'] =
        getClaimsBoundedClaimsToAttributesReducerMock.mockReturnValueOnce(
          mockReducer,
        );
    });

    it('should get the reducer bounded with the given claims', () => {
      // action
      service['mapRequestedAttributesFromClaims'](
        claimsMock,
        requestedAttributesMock,
      );

      // expect
      expect(
        getClaimsBoundedClaimsToAttributesReducerMock,
      ).toHaveBeenCalledTimes(1);
      expect(
        getClaimsBoundedClaimsToAttributesReducerMock,
      ).toHaveBeenCalledWith(claimsMock);
    });

    it('should return the reduce result', () => {
      // action
      const result = service['mapRequestedAttributesFromClaims'](
        claimsMock,
        requestedAttributesMock,
      );

      // expect
      expect(result).toStrictEqual(mockReduceResult);
    });
  });

  describe('getClaimsBoundedClaimsToAttributesReducer', () => {
    it('should bind the OidcToEidasService and the claims to the claimsToAttributesReducer function', () => {
      // setup
      service['claimsToAttributesReducer'] = jest.fn();
      service['claimsToAttributesReducer'].bind = jest.fn();

      // action
      service['getClaimsBoundedClaimsToAttributesReducer'](claimsMock);

      // expect
      expect(service['claimsToAttributesReducer'].bind).toHaveBeenCalledTimes(
        1,
      );
      expect(service['claimsToAttributesReducer'].bind).toHaveBeenCalledWith(
        OidcToEidasService,
        claimsMock,
      );
    });

    it('should return the claimsToAttributesReducer bounded function', () => {
      // action
      const result =
        service['getClaimsBoundedClaimsToAttributesReducer'](claimsMock);

      // expect
      expect(result).toBeInstanceOf(Function);
    });
  });

  describe('claimsToAttributesReducer', () => {
    describe('requestedAttribute is mappable', () => {
      it('should return the mapped response attribute within the given the claims and the requested attribute', () => {
        // setup
        const accumulator = {};
        const expected = { dateOfBirth: ['1962-08-24'] };

        // action
        const result = service['claimsToAttributesReducer'](
          claimsMock,
          accumulator,
          EidasAttributes.DATE_OF_BIRTH,
        );

        // expect
        expect(accumulator).toStrictEqual(expected);
        expect(result).toStrictEqual(expected);
      });
    });

    describe('requestedAttribute is not mappable', () => {
      it('should return the empty accumulatormulator object', () => {
        // setup
        const accumulator = {};
        const expected = {};

        // action
        const result = service['claimsToAttributesReducer'](
          claimsMock,
          accumulator,
          EidasAttributes.CURRENT_ADDRESS,
        );

        // expect
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
      // action
      service['mapScopesToRequestedAttributes'](oidcScopesMock);

      // expect
      expect(reduceMock).toHaveBeenCalledTimes(1);
      expect(reduceMock).toHaveBeenCalledWith(
        service['scopesToRequestedAttributesReducer'],
        expect.any(Set),
      );
    });

    it('should return the reduced attributes set', () => {
      // setup
      const expected = [
        EidasAttributes.PERSON_IDENTIFIER,
        EidasAttributes.CURRENT_GIVEN_NAME,
        EidasAttributes.CURRENT_FAMILY_NAME,
        EidasAttributes.DATE_OF_BIRTH,
      ];
      reduceMock.mockReturnValueOnce(expected);

      // action
      const result = service['mapScopesToRequestedAttributes'](oidcScopesMock);

      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should return the minimum attributes set', () => {
      // setup
      const emptyOidcScopesMock = [];
      emptyOidcScopesMock.reduce = reduceMock;

      const expected = [
        EidasAttributes.PERSON_IDENTIFIER,
        EidasAttributes.CURRENT_GIVEN_NAME,
        EidasAttributes.CURRENT_FAMILY_NAME,
        EidasAttributes.DATE_OF_BIRTH,
      ];
      reduceMock.mockReturnValueOnce(expected);

      // action
      const result =
        service['mapScopesToRequestedAttributes'](emptyOidcScopesMock);

      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('scopesToRequestedAttributesReducer', () => {
    it('should add to the set requested attribute equivalent to the given oidc scope and return the set', () => {
      // setup
      const attributesSetMock = new Set<EidasAttributes>();
      const expectedSet = new Set<EidasAttributes>([
        EidasAttributes.PERSON_IDENTIFIER,
      ]);

      // action
      const result = service['scopesToRequestedAttributesReducer'](
        attributesSetMock,
        'openid',
      );

      // expect
      expect(result).toStrictEqual(expectedSet);
    });

    it('should not add anything to the set if there is no equivalent to the given scope', () => {
      // setup
      const attributesSetMock = new Set<EidasAttributes>();

      // action
      const result = service['scopesToRequestedAttributesReducer'](
        attributesSetMock,
        'What is love ?',
      );

      // expect
      expect(result).toStrictEqual(attributesSetMock);
    });
  });
});
