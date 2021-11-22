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

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
  };

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

  it('should set the logger context', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.setContext).toHaveBeenCalledWith(
      'EidasProviderService',
    );
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
      // action
      service.onModuleInit();

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasProvider');
    });

    it('should get the call the apacheIgnite service to retrieve the proxyService request cache', () => {
      // action
      service.onModuleInit();

      // expect
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        1,
        proxyServiceRequestCache,
      );
    });

    it('should store the proxyService response cache in the private service.proxyServiceRequestCache', () => {
      // setup
      const proxyServiceRequestCacheMock = {
        foo: jest.fn(),
      };
      const proxyServiceResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(proxyServiceRequestCacheMock)
        .mockReturnValueOnce(proxyServiceResponseCacheMock);

      // action
      service.onModuleInit();

      // expect
      expect(service['proxyServiceRequestCache']).toStrictEqual(
        proxyServiceRequestCacheMock,
      );
    });

    it('should store the proxyService response cache in the private service.proxyServiceRequestCache', () => {
      // setup
      const proxyServiceRequestCacheMock = {
        foo: jest.fn(),
      };
      const proxyServiceResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(proxyServiceRequestCacheMock)
        .mockReturnValueOnce(proxyServiceResponseCacheMock);

      // action
      service.onModuleInit();

      // expect
      expect(service['proxyServiceResponseCache']).toStrictEqual(
        proxyServiceResponseCacheMock,
      );
    });

    it('should get the call the apacheIgnite service to retrieve the proxyService response cache', () => {
      // action
      service.onModuleInit();

      // expect
      expect(apacheIgniteServiceMock.getCache).toHaveBeenCalledTimes(2);
      expect(apacheIgniteServiceMock.getCache).toHaveBeenNthCalledWith(
        2,
        proxyServiceResponseCache,
      );
    });

    it('should store the proxyService response cache in the private service.proxyServiceRequestCache', () => {
      // setup
      const proxyServiceRequestCacheMock = {
        foo: jest.fn(),
      };
      const proxyServiceResponseCacheMock = {
        bar: jest.fn(),
      };

      apacheIgniteServiceMock.getCache
        .mockReturnValueOnce(proxyServiceRequestCacheMock)
        .mockReturnValueOnce(proxyServiceResponseCacheMock);

      // action
      service.onModuleInit();

      // expect
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
      // action
      await service.readLightRequestFromCache(token);

      // expect
      expect(lightRequestServiceMock.parseToken).toHaveBeenCalledTimes(1);
      expect(lightRequestServiceMock.parseToken).toHaveBeenCalledWith(token);
    });

    it('should read the light request in cache with the given id calling the proxyServiceRequestCache get method', async () => {
      // action
      await service.readLightRequestFromCache(token);

      // expect
      expect(proxyServiceRequestCacheMock.get).toHaveBeenCalledTimes(1);
      expect(proxyServiceRequestCacheMock.get).toHaveBeenCalledWith(
        tokenParsed.id,
      );
    });

    it('should return the light request from the cache', async () => {
      // setup
      const expectedLightRequest = "Look at me, I'm the LightRequest now !";
      proxyServiceRequestCacheMock.get.mockResolvedValueOnce(
        expectedLightRequest,
      );

      // action
      const result = await service.readLightRequestFromCache(token);

      // expect
      expect(result).toStrictEqual(expectedLightRequest);
    });

    it('should throw a ReadLightRequestFromCacheException if something went wrong when writing the light request in the cache', async () => {
      // setup
      proxyServiceRequestCacheMock.get.mockRejectedValueOnce(new Error('any'));

      // action / expect
      await expect(
        service.readLightRequestFromCache(token),
      ).rejects.toThrowError(ReadLightRequestFromCacheException);
    });
  });

  describe('parseLightRequest', () => {
    const lightRequest = 'Tchoo ! tchoo ! Request is comming !';

    it('should parse the light request using the toJson method from the light request service', () => {
      // action
      service.parseLightRequest(lightRequest);

      // expect
      expect(lightRequestServiceMock.parseRequest).toHaveBeenCalledTimes(1);
      expect(lightRequestServiceMock.parseRequest).toHaveBeenCalledWith(
        lightRequest,
      );
    });

    it('should return the request parsed as json', () => {
      // setup
      const request = {
        id: 'id',
      };
      lightRequestServiceMock.parseRequest.mockReturnValueOnce(request);

      // action
      const result = service.parseLightRequest(lightRequest);

      // expect
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
      // action
      service.completeFcSuccessResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // expect
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledWith(64);
    });

    it('should return a complete eidas response', () => {
      // setup
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

      // action
      const result = service.completeFcSuccessResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // expect
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
      // action
      service.completeFcFailureResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // expect
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledTimes(1);
      expect(cryptographyServiceMock.genRandomString).toHaveBeenCalledWith(64);
    });

    it('should return a complete eidas response', () => {
      // setup
      const expected: EidasResponse = {
        id: randomMock,
        inResponseToId: eidasRequestMock.id,
        issuer: 'FR EidasBridge - ProxyService',
        relayState: eidasRequestMock.relayState,
        status: partialEidasResponseMock.status,
      };

      // action
      const result = service.completeFcFailureResponse(
        partialEidasResponseMock,
        eidasRequestMock,
      );

      // expect
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
      // action
      service.prepareLightResponse(responseMock);

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasProvider');
    });

    it('should generate a token with the id in the response and the proxyServiceResponseIssuer using the light response service', () => {
      // action
      service.prepareLightResponse(responseMock);

      // expect
      expect(lightResponseServiceMock.generateToken).toHaveBeenCalledTimes(1);
      expect(lightResponseServiceMock.generateToken).toHaveBeenCalledWith(
        responseMock.id,
        proxyServiceResponseIssuer,
      );
    });

    it('should generate build a light response XML with the light response service "formatResponse" function', () => {
      // action
      service.prepareLightResponse(responseMock);

      // expect
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
      // action
      await service.writeLightResponseInCache(id, lightRequest);

      // expect
      expect(proxyServiceResponseCacheMock.put).toHaveBeenCalledTimes(1);
      expect(proxyServiceResponseCacheMock.put).toHaveBeenCalledWith(
        id,
        lightRequest,
      );
    });

    it('should throw a WriteLightResponseInCacheException if something went wrong when writing the light request in the cache', async () => {
      // setup
      proxyServiceResponseCacheMock.put.mockRejectedValueOnce(new Error('any'));

      // action / expect
      await expect(
        service.writeLightResponseInCache(id, lightRequest),
      ).rejects.toThrowError(WriteLightResponseInCacheException);
    });
  });
});
