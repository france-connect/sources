import { Test, TestingModule } from '@nestjs/testing';

import { ApacheIgniteService } from '@fc/apache-ignite';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasPartialRequest,
  EidasRequest,
  EidasResponse,
} from '@fc/eidas';
import { EidasCountries } from '@fc/eidas-country';
import {
  LightRequestService,
  LightResponseService,
} from '@fc/eidas-light-protocol';

import { EidasClientService } from './eidas-client.service';
import {
  ReadLightResponseFromCacheException,
  WriteLightRequestInCacheException,
} from './exceptions';
import { InvalidResponseIdException } from './exceptions/invalid-response-id.exception';
import { InvalidResponseRelayStateException } from './exceptions/invalid-response-relay-state.exception';

describe('EidasClientService', () => {
  let service: EidasClientService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const apacheIgniteServiceMock = {
    getCache: jest.fn(),
  };

  const cryptographyServiceMock = {
    genRandomString: jest.fn(),
  };

  const lightRequestServiceMock = {
    generateToken: jest.fn(),
    formatRequest: jest.fn(),
  };

  const lightResponseServiceMock = {
    parseToken: jest.fn(),
    parseResponse: jest.fn(),
  };

  const connectorRequestCacheMock = {
    put: jest.fn(),
  };

  const connectorResponseCacheMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EidasClientService,
        ConfigService,
        ApacheIgniteService,
        CryptographyService,
        LightRequestService,
        LightResponseService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(ApacheIgniteService)
      .useValue(apacheIgniteServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .overrideProvider(LightRequestService)
      .useValue(lightRequestServiceMock)
      .overrideProvider(LightResponseService)
      .useValue(lightResponseServiceMock)
      .compile();

    service = module.get<EidasClientService>(EidasClientService);

    service['connectorRequestCache'] = connectorRequestCacheMock;
    service['connectorResponseCache'] = connectorResponseCacheMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    const connectorRequestCache = 'connectorRequestCache';
    const connectorResponseCache = 'connectorResponseCache';

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        connectorRequestCache,
        connectorResponseCache,
      });
    });

    it('should get the connectorRequestCache and the connectorResponseCache from the config', () => {
      // When
      service.onModuleInit();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasClient');
    });

    it('should get the call the apacheIgnite service to retrieve the connector request cache', () => {
      // When
      service.onModuleInit();

      // Then
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        1,
        connectorRequestCache,
      );
    });

    it('should store the connector response cache in the private service.connectorRequestCache', () => {
      // Given
      const connectorRequestCacheMock = {
        foo: jest.fn(),
      };
      const connectorResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(connectorRequestCacheMock)
        .mockReturnValueOnce(connectorResponseCacheMock);

      // When
      service.onModuleInit();

      // Then
      expect(service['connectorRequestCache']).toStrictEqual(
        connectorRequestCacheMock,
      );
    });

    it('should store the connector response cache in the private service.connectorRequestCache', () => {
      // Given
      const connectorRequestCacheMock = {
        foo: jest.fn(),
      };
      const connectorResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(connectorRequestCacheMock)
        .mockReturnValueOnce(connectorResponseCacheMock);

      // When
      service.onModuleInit();

      // Then
      expect(service['connectorResponseCache']).toStrictEqual(
        connectorResponseCacheMock,
      );
    });

    it('should get the call the apacheIgnite service to retrieve the connector response cache', () => {
      // When
      service.onModuleInit();

      // Then
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        2,
        connectorResponseCache,
      );
    });

    it('should store the connector response cache in the private service.connectorRequestCache', () => {
      // Given
      const connectorRequestCacheMock = {
        foo: jest.fn(),
      };
      const connectorResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(connectorRequestCacheMock)
        .mockReturnValueOnce(connectorResponseCacheMock);

      // When
      service.onModuleInit();

      // Then
      expect(service['connectorResponseCache']).toStrictEqual(
        connectorResponseCacheMock,
      );
    });
  });

  describe('completeEidasRequest', () => {
    const partialRequestJson: EidasPartialRequest = {
      levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
      requestedAttributes: [
        EidasAttributes.PERSON_IDENTIFIER,
        EidasAttributes.CURRENT_FAMILY_NAME,
        EidasAttributes.CURRENT_GIVEN_NAME,
        EidasAttributes.DATE_OF_BIRTH,
        EidasAttributes.CURRENT_ADDRESS,
        EidasAttributes.GENDER,
        EidasAttributes.BIRTH_NAME,
        EidasAttributes.PLACE_OF_BIRTH,
      ],
    };
    const requestJson = {
      ...partialRequestJson,
      id: '0835656565',
      citizenCountryCode: 'BE',
      issuer: 'EIDASBridge Connector',
      nameIdFormat: 'unspecified',
      providerName: 'FranceConnect',
      spType: 'public',
      relayState: 'myState',
      spCountryCode: EidasCountries.FRANCE,
    };
    const countryMock = EidasCountries.BELGIUM;

    it('should generate a 64 bytes random for the request id', () => {
      // When
      service.completeEidasRequest(partialRequestJson, countryMock);

      // Then
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(2);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenNthCalledWith(
        1,
        64,
      );
    });

    it('should generate a 32 bytes random for the request relay state', () => {
      // When
      service.completeEidasRequest(partialRequestJson, countryMock);

      // Then
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(2);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenNthCalledWith(
        2,
        32,
      );
    });

    it('should return the complete eidas request', () => {
      // Given
      cryptographyServiceMock.genRandomString
        .mockReturnValueOnce(requestJson.id)
        .mockReturnValueOnce(requestJson.relayState);

      // When
      const result = service.completeEidasRequest(
        partialRequestJson,
        countryMock,
      );

      // Then
      expect(result).toStrictEqual(requestJson);
    });
  });

  describe('prepareLightRequest', () => {
    const connectorRequestIssuer = 'connectorRequestIssuer';
    const requestMock = {
      id: 'id',
      state: 'state',
    } as unknown as EidasRequest;

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        connectorRequestIssuer,
      });
    });

    it('should get the connectorRequestIssuer from the config', () => {
      // When
      service.prepareLightRequest(requestMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasClient');
    });

    it('should generate a token with the id in the request and the connectorRequestIssuer using the light request service', () => {
      // When
      service.prepareLightRequest(requestMock);

      // Then
      expect(lightRequestServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightRequestServiceMock.generateToken).toHaveBeenCalledWith(
        requestMock.id,
        connectorRequestIssuer,
      );
    });

    it('should generate build a light request XML with the light request service "formatRequest" function', () => {
      // When
      service.prepareLightRequest(requestMock);

      // Then
      expect(lightRequestServiceMock.formatRequest).toHaveBeenCalledTimes(1);
      expect(lightRequestServiceMock.formatRequest).toHaveBeenCalledWith(
        requestMock,
      );
    });
  });

  describe('writeLightRequestInCache', () => {
    const id = 'id';
    const lightRequest = 'lightRequest';

    it('should put write the given light request in cache with the given id calling the connectorRequestCache put method', async () => {
      // When
      await service.writeLightRequestInCache(id, lightRequest);

      // Then
      expect(connectorRequestCacheMock.put).toHaveBeenCalledTimes(1);
      expect(connectorRequestCacheMock.put).toHaveBeenCalledWith(
        id,
        lightRequest,
      );
    });

    it('should throw a WriteLightRequestInCacheException if something went wrong when writing the light request in the cache', async () => {
      // Given
      connectorRequestCacheMock.put.mockRejectedValueOnce(new Error('any'));

      // When / Then
      await expect(
        service.writeLightRequestInCache(id, lightRequest),
      ).rejects.toThrowError(WriteLightRequestInCacheException);
    });
  });

  describe('readLightResponseFromCache', () => {
    const token =
      'SGV5LCBzZXJpb3VzbHksIGRpZCB5b3UgcmVhbGx5IGV4cGVjdCB0byBmaW5kIHNtZXRoaW5nIGhlcmUgOkQgPw==';
    const tokenParsed = { id: 'id' };

    beforeEach(() => {
      lightResponseServiceMock.parseToken.mockReturnValueOnce(tokenParsed);
    });

    it('should parse the given token with parseToken from light response service', async () => {
      // When
      await service.readLightResponseFromCache(token);

      // Then
      expect(lightResponseServiceMock.parseToken).toHaveBeenCalledTimes(1);
      expect(lightResponseServiceMock.parseToken).toHaveBeenCalledWith(token);
    });

    it('should put write the given light request in cache with the given id calling the connectorRequestCache put method', async () => {
      // When
      await service.readLightResponseFromCache(token);

      // Then
      expect(connectorResponseCacheMock.get).toHaveBeenCalledTimes(1);
      expect(connectorResponseCacheMock.get).toHaveBeenCalledWith(
        tokenParsed.id,
      );
    });

    it('should return the light response from the cache', async () => {
      // Given
      const expectedLightResponse = "Look at me, I'm the LightResponse now !";
      connectorResponseCacheMock.get.mockResolvedValueOnce(
        expectedLightResponse,
      );

      // When
      const result = await service.readLightResponseFromCache(token);

      // Then
      expect(result).toStrictEqual(expectedLightResponse);
    });

    it('should throw a ReadLightResponseFromCacheException if something went wrong when writing the light request in the cache', async () => {
      // Given
      connectorResponseCacheMock.get.mockRejectedValueOnce(new Error('any'));

      // When / Then
      await expect(
        service.readLightResponseFromCache(token),
      ).rejects.toThrowError(ReadLightResponseFromCacheException);
    });
  });

  describe('parseLightResponse', () => {
    const lightResponse = 'Tchoo ! tchoo ! Response is comming !';

    it('should parse the light response using the parseResponse method from the light request service', () => {
      // When
      service.parseLightResponse(lightResponse);

      // Then
      expect(lightResponseServiceMock.parseResponse).toHaveBeenCalledTimes(1);
      expect(lightResponseServiceMock.parseResponse).toHaveBeenCalledWith(
        lightResponse,
      );
    });

    it('should return the response parsed as json', () => {
      // Given
      const response = {
        id: 'id',
      };
      lightResponseServiceMock.parseResponse.mockReturnValueOnce(response);

      // When
      const result = service.parseLightResponse(lightResponse);

      // Then
      expect(result).toStrictEqual(response);
    });
  });

  describe('checkEidasResponse', () => {
    let requestMock: EidasRequest;
    let responseMock: EidasResponse;

    beforeEach(() => {
      requestMock = {
        id: 'reqId',
        relayState: 'relayStateMock',
      } as unknown as EidasRequest;

      responseMock = {
        id: 'resId',
        relayState: 'relayStateMock',
        inResponseToId: 'reqId',
      } as unknown as EidasResponse;
    });

    it('should not throw if "inResponseToId" matches the request "id" and the relayState is the same', () => {
      // When / Then
      expect(() =>
        service.checkEidasResponse(requestMock, responseMock),
      ).not.toThrow();
    });

    it('should throw InvalidResponseIdException if "inResponseToId" does not match the request "id"', () => {
      // Given
      responseMock.inResponseToId = 'bad-req-id';

      // When / Then
      expect(() =>
        service.checkEidasResponse(requestMock, responseMock),
      ).toThrow(InvalidResponseIdException);
    });

    it('should not throw if the request "relayState" is not defined', () => {
      // Given
      delete requestMock.relayState;

      // When / Then
      expect(() =>
        service.checkEidasResponse(requestMock, responseMock),
      ).not.toThrow();
    });

    it('should throw InvalidResponseRelayStateException if the request "relayState" is defined but does not match the response "relayState"', () => {
      // Given
      responseMock.relayState = 'some-other-relayState';

      // When / Then
      expect(() =>
        service.checkEidasResponse(requestMock, responseMock),
      ).toThrow(InvalidResponseRelayStateException);
    });
  });
});
