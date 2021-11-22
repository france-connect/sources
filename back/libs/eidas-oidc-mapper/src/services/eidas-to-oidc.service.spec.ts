import { Test, TestingModule } from '@nestjs/testing';

import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasResponse,
  EidasStatusCodes,
  EidasSubStatusCodes,
} from '@fc/eidas';
import { LoggerService } from '@fc/logger';
import { AcrValues } from '@fc/oidc';

import { EidasToOidcService } from './eidas-to-oidc.service';

describe('EidasToOidcService', () => {
  let service: EidasToOidcService;

  const eidasRequestMock = {
    levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
    requestedAttributes: [
      EidasAttributes.PERSON_IDENTIFIER,
      EidasAttributes.CURRENT_FAMILY_NAME,
      EidasAttributes.CURRENT_GIVEN_NAME,
      EidasAttributes.DATE_OF_BIRTH,
    ],
  };

  const expectedPartialRequest = {
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    acr_values: AcrValues.EIDAS2,
    scope: [
      'openid',
      'preferred_username',
      'family_name',
      'given_name',
      'birthdate',
    ],
  };

  const attributesMock = {
    [EidasAttributes.PERSON_IDENTIFIER]: ['0123456789'],
    [EidasAttributes.CURRENT_GIVEN_NAME]: ['Jean'],
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EidasToOidcService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<EidasToOidcService>(EidasToOidcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('mapPartialRequest', () => {
    const mapRequestedAttributesToScopesMock = jest.fn();

    it('should map the oidc scopes with the eidas requested attributes', () => {
      // setup
      service['mapRequestedAttributesToScopes'] =
        mapRequestedAttributesToScopesMock.mockReturnValueOnce(
          expectedPartialRequest.scope,
        );

      // action
      service.mapPartialRequest(eidasRequestMock);

      // expect
      expect(mapRequestedAttributesToScopesMock).toHaveBeenCalledTimes(1);
      expect(mapRequestedAttributesToScopesMock).toHaveBeenCalledWith(
        eidasRequestMock.requestedAttributes,
      );
    });

    it('should return a partial eidas request with mapped loa and attributes', () => {
      // setup
      service['mapRequestedAttributesToScopes'] =
        mapRequestedAttributesToScopesMock.mockReturnValueOnce(
          expectedPartialRequest.scope,
        );

      // action
      const result = service.mapPartialRequest(eidasRequestMock);

      // expect
      expect(result).toStrictEqual(expectedPartialRequest);
    });
  });

  describe('mapPartialResponseSuccess', () => {
    const EidasResponseMock = {
      attributes: {
        [EidasAttributes.PERSON_IDENTIFIER]: ['0123456789'],
        [EidasAttributes.CURRENT_GIVEN_NAME]: ['Jean'],
        [EidasAttributes.CURRENT_FAMILY_NAME]: ['Eude'],
        [EidasAttributes.DATE_OF_BIRTH]: ['1998-02-03'],
      },
      levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
    } as unknown as EidasResponse;

    const mapAttributesToClaimsMock = jest.fn();

    beforeEach(() => {
      service['mapAttributesToClaims'] = mapAttributesToClaimsMock;
    });

    it('should call mapAttributesToClaims with the given attributes', () => {
      // action
      service.mapPartialResponseSuccess(EidasResponseMock);

      // expect
      expect(mapAttributesToClaimsMock).toHaveBeenCalledTimes(1);
      expect(mapAttributesToClaimsMock).toHaveBeenCalledWith(
        EidasResponseMock.attributes,
      );
    });

    it('should return the corresponding oidc claims and the acr', () => {
      // setup
      const claimsMock = {
        birthdate: '1998-02-03',

        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        family_name: 'Eude',

        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        given_name: 'Jean',

        sub: '0123456789',
      };
      const acrMock = AcrValues.EIDAS2;
      mapAttributesToClaimsMock.mockReturnValueOnce(claimsMock);

      // action
      const result = service.mapPartialResponseSuccess(EidasResponseMock);

      // expect
      expect(result).toStrictEqual({
        acr: acrMock,
        userinfos: claimsMock,
      });
    });
  });

  describe('mapPartialResponseFailure', () => {
    const eidasResponse = {
      status: {
        statusCode: EidasStatusCodes.SUCCESS,
        statusMessage: 'This is a message',
        subStatusCode: EidasSubStatusCodes.AUTHN_FAILED,
      },
    } as EidasResponse;

    const expectedError = {
      error: 'eidas_node_error',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      error_description: `StatusCode: ${eidasResponse.status.statusCode}\nSubStatusCode: ${eidasResponse.status.subStatusCode}\nStatusMessage: ${eidasResponse.status.statusMessage}`,
    };

    it('should return an oidc error from an eidas error', () => {
      // action
      const result = service.mapPartialResponseFailure(eidasResponse);

      // expect
      expect(result).toStrictEqual(expectedError);
    });
  });

  describe('mapRequestedAttributesToScopes', () => {
    it('should return the mapped scopes in a set for the requested attributes', () => {
      // setup
      const expectedScope = new Set<string>(expectedPartialRequest.scope);

      // action
      const result = service['mapRequestedAttributesToScopes'](
        eidasRequestMock.requestedAttributes,
      );

      // expect
      expect(result).toStrictEqual(expectedScope);
    });

    it('should at least have the openid scope in a set if there is no requested attribute', () => {
      // setup
      const eidasEmptyRequestedAttributesMock = [];
      const expectedScope = new Set<string>(['openid']);

      // action
      const result = service['mapRequestedAttributesToScopes'](
        eidasEmptyRequestedAttributesMock,
      );

      // expect
      expect(result).toStrictEqual(expectedScope);
    });
  });

  describe('requestedAttributesToScopesReducer', () => {
    it('should return the scope within a set for the given eidas attribute if it exists', () => {
      // setup
      const scopeSet = new Set<string>();
      const expected = new Set<string>(['family_name', 'preferred_username']);

      // action
      const result = service['requestedAttributesToScopesReducer'](
        scopeSet,
        EidasAttributes.CURRENT_FAMILY_NAME,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should return an empty set for the given eidas attribute if it exists', () => {
      // setup
      const scopeSet = new Set<string>();
      const expected = new Set<string>();

      // action
      const result = service['requestedAttributesToScopesReducer'](
        scopeSet,
        EidasAttributes.CURRENT_ADDRESS,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('requestedAttributesToScopesReducer', () => {
    const getClaimsBoundedAttributesToClaimsReducerMock = jest.fn();
    const expectedReduced = { currentGivenName: true, personIdentifier: true };

    beforeEach(() => {
      getClaimsBoundedAttributesToClaimsReducerMock.mockReturnValueOnce(
        (accu, attr) => {
          accu[attr] = true;
          return accu;
        },
      );

      service['getClaimsBoundedAttributesToClaimsReducer'] =
        getClaimsBoundedAttributesToClaimsReducerMock;
    });

    it('should call getClaimsBoundedAttributesToClaimsReducerMock with the attribures', () => {
      // action
      service['mapAttributesToClaims'](attributesMock);

      // expect
      expect(
        getClaimsBoundedAttributesToClaimsReducerMock,
      ).toHaveBeenCalledTimes(1);
      expect(
        getClaimsBoundedAttributesToClaimsReducerMock,
      ).toHaveBeenCalledWith(attributesMock);
    });

    it('should return the result of the reduce operation', () => {
      // action
      const result = service['mapAttributesToClaims'](attributesMock);

      // expect
      expect(result).toStrictEqual(expectedReduced);
    });
  });

  describe('getClaimsBoundedAttributesToClaimsReducer', () => {
    it('should bind the attributesToClaimsReducer with the EidasToOidc service and the eidas attributes', () => {
      // setup
      const attributesToClaimsReducerMock = jest.fn();
      attributesToClaimsReducerMock.bind = jest.fn();
      service['attributesToClaimsReducer'] = attributesToClaimsReducerMock;

      // action
      service['getClaimsBoundedAttributesToClaimsReducer'](attributesMock);

      // expect
      expect(attributesToClaimsReducerMock.bind).toHaveBeenCalledTimes(1);
      expect(attributesToClaimsReducerMock.bind).toHaveBeenCalledWith(
        EidasToOidcService,
        attributesMock,
      );
    });

    it('should bind the attributesToClaimsReducer with the EidasToOidc service and the eidas attributes', () => {
      // action
      const result =
        service['getClaimsBoundedAttributesToClaimsReducer'](attributesMock);

      // expect
      expect(result).toStrictEqual(expect.any(Function));
    });
  });

  describe('attributesToClaimsReducer', () => {
    it('should assign the current eidas attribute to the oidc claims if found', () => {
      // setup
      const expected = { sub: '0123456789' };

      // action
      const result = service['attributesToClaimsReducer'](
        attributesMock,
        {},
        EidasAttributes.PERSON_IDENTIFIER,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should assign the current eidas attribute to the oidc claims if not found', () => {
      // setup
      const expected = {};

      // action
      const result = service['attributesToClaimsReducer'](
        attributesMock,
        {},
        'what',
      );

      // expect
      expect(result).toStrictEqual(expected);
    });
  });
});
