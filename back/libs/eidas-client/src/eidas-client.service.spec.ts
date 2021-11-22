import { Test, TestingModule } from '@nestjs/testing';

import { ApacheIgniteService } from '@fc/apache-ignite';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasPartialRequest,
  EidasRequest,
} from '@fc/eidas';
import { EidasCountries } from '@fc/eidas-country';
import {
  LightRequestService,
  LightResponseService,
} from '@fc/eidas-light-protocol';
import { LoggerService } from '@fc/logger';

import { EidasClientService } from './eidas-client.service';
import {
  ReadLightResponseFromCacheException,
  WriteLightRequestInCacheException,
} from './exceptions';

describe('EidasClientService', () => {
  let service: EidasClientService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
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
        LoggerService,
        ApacheIgniteService,
        CryptographyService,
        LightRequestService,
        LightResponseService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
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

  it('should set the logger context', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.setContext).toHaveBeenCalledWith(
      'EidasClientService',
    );
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
      // action
      service.onModuleInit();

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasClient');
    });

    it('should get the call the apacheIgnite service to retrieve the connector request cache', () => {
      // action
      service.onModuleInit();

      // expect
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        1,
        connectorRequestCache,
      );
    });

    it('should store the connector response cache in the private service.connectorRequestCache', () => {
      // setup
      const connectorRequestCacheMock = {
        foo: jest.fn(),
      };
      const connectorResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(connectorRequestCacheMock)
        .mockReturnValueOnce(connectorResponseCacheMock);

      // action
      service.onModuleInit();

      // expect
      expect(service['connectorRequestCache']).toStrictEqual(
        connectorRequestCacheMock,
      );
    });

    it('should store the connector response cache in the private service.connectorRequestCache', () => {
      // setup
      const connectorRequestCacheMock = {
        foo: jest.fn(),
      };
      const connectorResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(connectorRequestCacheMock)
        .mockReturnValueOnce(connectorResponseCacheMock);

      // action
      service.onModuleInit();

      // expect
      expect(service['connectorResponseCache']).toStrictEqual(
        connectorResponseCacheMock,
      );
    });

    it('should get the call the apacheIgnite service to retrieve the connector response cache', () => {
      // action
      service.onModuleInit();

      // expect
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        2,
        connectorResponseCache,
      );
    });

    it('should store the connector response cache in the private service.connectorRequestCache', () => {
      // setup
      const connectorRequestCacheMock = {
        foo: jest.fn(),
      };
      const connectorResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(connectorRequestCacheMock)
        .mockReturnValueOnce(connectorResponseCacheMock);

      // action
      service.onModuleInit();

      // expect
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
    };
    const countryMock = EidasCountries.BELGIUM;

    it('should generate a 64 bytes random for the request id', async () => {
      // action
      await service.completeEidasRequest(partialRequestJson, countryMock);

      // expect
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(2);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenNthCalledWith(
        1,
        64,
      );
    });

    it('should generate a 32 bytes random for the request relay state', async () => {
      // action
      await service.completeEidasRequest(partialRequestJson, countryMock);

      // expect
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(2);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenNthCalledWith(
        2,
        32,
      );
    });

    it('should return the complete eidas request', async () => {
      // setup
      cryptographyServiceMock.genRandomString
        .mockReturnValueOnce(requestJson.id)
        .mockReturnValueOnce(requestJson.relayState);

      // action
      const result = await service.completeEidasRequest(
        partialRequestJson,
        countryMock,
      );

      // expect
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
      // action
      service.prepareLightRequest(requestMock);

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasClient');
    });

    it('should generate a token with the id in the request and the connectorRequestIssuer using the light request service', () => {
      // action
      service.prepareLightRequest(requestMock);

      // expect
      expect(lightRequestServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightRequestServiceMock.generateToken).toHaveBeenCalledWith(
        requestMock.id,
        connectorRequestIssuer,
      );
    });

    it('should generate build a light request XML with the light request service "formatRequest" function', () => {
      // action
      service.prepareLightRequest(requestMock);

      // expect
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
      // action
      await service.writeLightRequestInCache(id, lightRequest);

      // expect
      expect(connectorRequestCacheMock.put).toHaveBeenCalledTimes(1);
      expect(connectorRequestCacheMock.put).toHaveBeenCalledWith(
        id,
        lightRequest,
      );
    });

    it('should throw a WriteLightRequestInCacheException if something went wrong when writing the light request in the cache', async () => {
      // setup
      connectorRequestCacheMock.put.mockRejectedValueOnce(new Error('any'));

      // action / expect
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
      // action
      await service.readLightResponseFromCache(token);

      // expect
      expect(lightResponseServiceMock.parseToken).toHaveBeenCalledTimes(1);
      expect(lightResponseServiceMock.parseToken).toHaveBeenCalledWith(token);
    });

    it('should put write the given light request in cache with the given id calling the connectorRequestCache put method', async () => {
      // action
      await service.readLightResponseFromCache(token);

      // expect
      expect(connectorResponseCacheMock.get).toHaveBeenCalledTimes(1);
      expect(connectorResponseCacheMock.get).toHaveBeenCalledWith(
        tokenParsed.id,
      );
    });

    it('should return the light response from the cache', async () => {
      // setup
      const expectedLightResponse = "Look at me, I'm the LightResponse now !";
      connectorResponseCacheMock.get.mockResolvedValueOnce(
        expectedLightResponse,
      );

      // action
      const result = await service.readLightResponseFromCache(token);

      // expect
      expect(result).toStrictEqual(expectedLightResponse);
    });

    it('should throw a ReadLightResponseFromCacheException if something went wrong when writing the light request in the cache', async () => {
      // setup
      connectorResponseCacheMock.get.mockRejectedValueOnce(new Error('any'));

      // action / expect
      await expect(
        service.readLightResponseFromCache(token),
      ).rejects.toThrowError(ReadLightResponseFromCacheException);
    });
  });

  describe('parseLightResponse', () => {
    const lightResponse = 'Tchoo ! tchoo ! Response is comming !';

    it('should parse the light response using the parseResponse method from the light request service', () => {
      // action
      service.parseLightResponse(lightResponse);

      // expect
      expect(lightResponseServiceMock.parseResponse).toHaveBeenCalledTimes(1);
      expect(lightResponseServiceMock.parseResponse).toHaveBeenCalledWith(
        lightResponse,
      );
    });

    it('should return the response parsed as json', () => {
      // setup
      const response = {
        id: 'id',
      };
      lightResponseServiceMock.parseResponse.mockReturnValueOnce(response);

      // action
      const result = service.parseLightResponse(lightResponse);

      // expect
      expect(result).toStrictEqual(response);
    });
  });
});
