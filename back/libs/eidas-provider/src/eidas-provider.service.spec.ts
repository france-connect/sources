import { Test, TestingModule } from '@nestjs/testing';

import { ApacheIgniteService } from '@fc/apache-ignite';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import {
  EidasAttributes,
  EidasLevelOfAssurances,
  EidasNameIdFormats,
  EidasRequest,
  EidasResponse,
} from '@fc/eidas';
import {
  LightRequestService,
  LightResponseService,
} from '@fc/eidas-light-protocol';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { EidasProviderService } from './eidas-provider.service';
import {
  ReadLightRequestFromCacheException,
  WriteLightResponseInCacheException,
} from './exceptions';

describe('EidasProviderService', () => {
  let service: EidasProviderService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  const cryptographyServiceMock = {
    genRandomString: jest.fn(),
  };

  const apacheIgniteServiceMock = {
    getCache: jest.fn(),
  };

  const lightRequestServiceMock = {
    parseToken: jest.fn(),
    parseRequest: jest.fn(),
  };

  const lightResponseServiceMock = {
    generateToken: jest.fn(),
    formatResponse: jest.fn(),
  };

  const proxyServiceRequestCacheMock = {
    get: jest.fn(),
  };

  const proxyServiceResponseCacheMock = {
    put: jest.fn(),
  };

  const eidasRequestMock = {
    id: 'waikiki-violet-35-bfi',
    relayState: 'relayState',
    levelOfAssurance: 'levelOfAssurance',
  } as unknown as EidasRequest;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EidasProviderService,
        ConfigService,
        LoggerService,
        CryptographyService,
        ApacheIgniteService,
        LightRequestService,
        LightResponseService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .overrideProvider(ApacheIgniteService)
      .useValue(apacheIgniteServiceMock)
      .overrideProvider(LightRequestService)
      .useValue(lightRequestServiceMock)
      .overrideProvider(LightResponseService)
      .useValue(lightResponseServiceMock)
      .compile();

    service = module.get<EidasProviderService>(EidasProviderService);

    service['proxyServiceRequestCache'] = proxyServiceRequestCacheMock;
    service['proxyServiceResponseCache'] = proxyServiceResponseCacheMock;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    const proxyServiceRequestCache = 'proxyServiceRequestCache';
    const proxyServiceResponseCache = 'proxyServiceResponseCache';

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        proxyServiceRequestCache,
        proxyServiceResponseCache,
      });
    });

    it('should get the proxyServiceRequestCache and the proxyServiceResponseCache from the config', () => {
      // When
      service.onModuleInit();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasProvider');
    });

    it('should get the call the apacheIgnite service to retrieve the proxyService request cache', () => {
      // When
      service.onModuleInit();

      // Then
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        1,
        proxyServiceRequestCache,
      );
    });

    it('should store the proxyService response cache in the private service.proxyServiceRequestCache', () => {
      // Given
      const proxyServiceRequestCacheMock = {
        foo: jest.fn(),
      };
      const proxyServiceResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(proxyServiceRequestCacheMock)
        .mockReturnValueOnce(proxyServiceResponseCacheMock);

      // When
      service.onModuleInit();

      // Then
      expect(service['proxyServiceRequestCache']).toStrictEqual(
        proxyServiceRequestCacheMock,
      );
    });

    it('should store the proxyService response cache in the private service.proxyServiceRequestCache', () => {
      // Given
      const proxyServiceRequestCacheMock = {
        foo: jest.fn(),
      };
      const proxyServiceResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(proxyServiceRequestCacheMock)
        .mockReturnValueOnce(proxyServiceResponseCacheMock);

      // When
      service.onModuleInit();

      // Then
      expect(service['proxyServiceResponseCache']).toStrictEqual(
        proxyServiceResponseCacheMock,
      );
    });

    it('should get the call the apacheIgnite service to retrieve the proxyService response cache', () => {
      // When
      service.onModuleInit();

      // Then
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        2,
        proxyServiceResponseCache,
      );
    });

    it('should store the proxyService response cache in the private service.proxyServiceRequestCache', () => {
      // Given
      const proxyServiceRequestCacheMock = {
        foo: jest.fn(),
      };
      const proxyServiceResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(proxyServiceRequestCacheMock)
        .mockReturnValueOnce(proxyServiceResponseCacheMock);

      // When
      service.onModuleInit();

      // Then
      expect(service['proxyServiceResponseCache']).toStrictEqual(
        proxyServiceResponseCacheMock,
      );
    });
  });

  describe('readLightRequestFromCache', () => {
    const token =
      'SGV5LCBzZXJpb3VzbHksIGRpZCB5b3UgcmVhbGx5IGV4cGVjdCB0byBmaW5kIHNtZXRoaW5nIGhlcmUgOkQgPw==';
    const tokenParsed = { id: 'id' };

    beforeEach(() => {
      lightRequestServiceMock.parseToken.mockReturnValueOnce(tokenParsed);
    });

    it('should parse the given token with parseToken from light request service', async () => {
      // When
      await service.readLightRequestFromCache(token);

      // Then
      expect(lightRequestServiceMock.parseToken).toHaveBeenCalledTimes(1);
      expect(lightRequestServiceMock.parseToken).toHaveBeenCalledWith(token);
    });

    it('should read the light request in cache with the given id calling the proxyServiceRequestCache get method', async () => {
      // When
      await service.readLightRequestFromCache(token);

      // Then
      expect(proxyServiceRequestCacheMock.get).toHaveBeenCalledTimes(1);
      expect(proxyServiceRequestCacheMock.get).toHaveBeenCalledWith(
        tokenParsed.id,
      );
    });

    it('should return the light request from the cache', async () => {
      // Given
      const expectedLightRequest = "Look at me, I'm the LightRequest now !";
      proxyServiceRequestCacheMock.get.mockResolvedValueOnce(
        expectedLightRequest,
      );

      // When
      const result = await service.readLightRequestFromCache(token);

      // Then
      expect(result).toStrictEqual(expectedLightRequest);
    });

    it('should throw a ReadLightRequestFromCacheException if something went wrong when writing the light request in the cache', async () => {
      // Given
      proxyServiceRequestCacheMock.get.mockRejectedValueOnce(new Error('any'));

      // When / Then
      await expect(
        service.readLightRequestFromCache(token),
      ).rejects.toThrowError(ReadLightRequestFromCacheException);
    });
  });

  describe('parseLightRequest', () => {
    const lightRequest = 'Tchoo ! tchoo ! Request is comming !';

    it('should parse the light request using the toJson method from the light request service', () => {
      // When
      service.parseLightRequest(lightRequest);

      // Then
      expect(lightRequestServiceMock.parseRequest).toHaveBeenCalledTimes(1);
      expect(lightRequestServiceMock.parseRequest).toHaveBeenCalledWith(
        lightRequest,
      );
    });

    it('should return the request parsed as json', () => {
      // Given
      const request = {
        id: 'id',
      };
      lightRequestServiceMock.parseRequest.mockReturnValueOnce(request);

      // When
      const result = service.parseLightRequest(lightRequest);

      // Then
      expect(result).toStrictEqual(request);
    });
  });

  describe('completeFcSuccessResponse', () => {
    const randomMock = 'cait-sith-slots';
    const partialEidasResponseMock = {
      subject: 'nanaki-red-13-ffiv',
      levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
      status: {
        failure: false,
      },
      attributes: {
        [EidasAttributes.BIRTH_NAME]: ['Nanaki'],
      },
    };

    beforeEach(() => {
      cryptographyServiceMock.genRandomString.mockReturnValueOnce(randomMock);
    });

    it('should generate a 64 characters random string', () => {
      // When
      service.completeFcSuccessResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // Then
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledWith(64);
    });

    it('should return a complete eidas response', () => {
      // Given
      const expected: EidasResponse = {
        attributes: partialEidasResponseMock.attributes,
        id: randomMock,
        inResponseToId: eidasRequestMock.id,
        issuer: 'FR EidasBridge - ProxyService',
        levelOfAssurance: partialEidasResponseMock.levelOfAssurance,
        relayState: eidasRequestMock.relayState,
        status: partialEidasResponseMock.status,
        subject: partialEidasResponseMock.subject,
        subjectNameIdFormat: EidasNameIdFormats.PERSISTENT,
      };

      // When
      const result = service.completeFcSuccessResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('completeFcFailureResponse', () => {
    const randomMock = 'cait-sith-slots';
    const partialEidasResponseMock = {
      status: {
        failure: true,
      },
    };

    beforeEach(() => {
      cryptographyServiceMock.genRandomString.mockReturnValueOnce(randomMock);
    });

    it('should generate a 64 characters random string', () => {
      // When
      service.completeFcFailureResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // Then
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledWith(64);
    });

    it('should return a complete eidas response', () => {
      // Given
      const expected: EidasResponse = {
        id: randomMock,
        inResponseToId: eidasRequestMock.id,
        issuer: 'FR EidasBridge - ProxyService',
        relayState: eidasRequestMock.relayState,
        status: partialEidasResponseMock.status,
      };

      // When
      const result = service.completeFcFailureResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('prepareLightResponse', () => {
    const proxyServiceResponseIssuer = 'proxyServiceResponseIssuer';
    const responseMock = {
      id: 'id',
      state: 'state',
    } as unknown as EidasResponse;

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        proxyServiceResponseIssuer,
      });
    });

    it('should get the proxyServiceResponseIssuer from the config', () => {
      // When
      service.prepareLightResponse(responseMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasProvider');
    });

    it('should generate a token with the id in the response and the proxyServiceResponseIssuer using the light response service', () => {
      // When
      service.prepareLightResponse(responseMock);

      // Then
      expect(lightResponseServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightResponseServiceMock.generateToken).toHaveBeenCalledWith(
        responseMock.id,
        proxyServiceResponseIssuer,
      );
    });

    it('should generate build a light response XML with the light response service "formatResponse" function', () => {
      // When
      service.prepareLightResponse(responseMock);

      // Then
      expect(lightResponseServiceMock.formatResponse).toHaveBeenCalledTimes(1);
      expect(lightResponseServiceMock.formatResponse).toHaveBeenCalledWith(
        responseMock,
      );
    });
  });

  describe('writeLightResponseInCache', () => {
    const id = 'id';
    const lightRequest = 'lightRequest';

    it('should put write the given light request in cache with the given id calling the connectorRequestCache put method', async () => {
      // When
      await service.writeLightResponseInCache(id, lightRequest);

      // Then
      expect(proxyServiceResponseCacheMock.put).toHaveBeenCalledTimes(1);
      expect(proxyServiceResponseCacheMock.put).toHaveBeenCalledWith(
        id,
        lightRequest,
      );
    });

    it('should throw a WriteLightResponseInCacheException if something went wrong when writing the light request in the cache', async () => {
      // Given
      proxyServiceResponseCacheMock.put.mockRejectedValueOnce(new Error('any'));

      // When / Then
      await expect(
        service.writeLightResponseInCache(id, lightRequest),
      ).rejects.toThrowError(WriteLightResponseInCacheException);
    });
  });
});
