import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { EidasProviderController } from './eidas-provider.controller';
import { EidasProviderService } from './eidas-provider.service';

describe('EidasProviderController', () => {
  let controller: EidasProviderController;

  const reqMock = {} as unknown as Request;

  const configMock = {
    proxyServiceResponseCacheUrl: 'proxyServiceResponseCacheUrl',
    redirectAfterRequestHandlingUrl: 'redirectAfterRequestHandlingUrl',
  };
  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerMock = getLoggerMock();

  const eidasProviderServiceMock = {
    completeFcFailureResponse: jest.fn(),
    completeFcSuccessResponse: jest.fn(),
    parseLightRequest: jest.fn(),
    prepareLightResponse: jest.fn(),
    readLightRequestFromCache: jest.fn(),
    writeLightResponseInCache: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const eidasRequestMock = {
    id: 'id',
    levelOfAssurance: 'levelOfAssurance',
    relayState: 'relayState',
  };

  const trackingServiceMock = {
    track: jest.fn(),
    TrackedEventsMap: {},
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EidasProviderController],
      providers: [
        ConfigService,
        LoggerService,
        EidasProviderService,
        TrackingService,
        SessionService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(EidasProviderService)
      .useValue(eidasProviderServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    controller = module.get<EidasProviderController>(EidasProviderController);

    configServiceMock.get.mockReturnValueOnce(configMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * :warning: This is a temporary controller, the tests should change with the integration
   * of the FranceConnect openid cinematic
   */
  describe('requestHandler', () => {
    const reqMock = {} as Request;
    const resMock = {} as Response;

    const body = {
      token:
        'VGhlIExvc3QgQmF0dGFsaW9uIGlzIHRoZSBuYW1lIGdpdmVuIHRvIG5pbmUgY29tcGFuaWVzIG9mIHRoZSBVbml0ZWQgU3RhdGVzIDc3OnRoIERpdmlzaW9uIGR1cmluZyB0aGUgYmF0dGxlIG9mIHRoZSBBcmdvbm5lIGluIDE5MTgu',
    };

    const lightRequestMock =
      "<LightRequest>If you believe, you'll see</LightRequest>";

    beforeEach(() => {
      eidasProviderServiceMock.readLightRequestFromCache.mockResolvedValueOnce(
        lightRequestMock,
      );
      eidasProviderServiceMock.parseLightRequest.mockReturnValueOnce(
        eidasRequestMock,
      );
    });

    it('should reset the session', async () => {
      // action
      await controller.requestHandler(reqMock, resMock, body);

      // expect
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(resMock);
    });

    it('should read the light-request corresponding to the token in the body from the cache', async () => {
      // action
      await controller.requestHandler(reqMock, resMock, body);

      // expect
      expect(
        eidasProviderServiceMock.readLightRequestFromCache,
      ).toHaveBeenCalledTimes(1);
      expect(
        eidasProviderServiceMock.readLightRequestFromCache,
      ).toHaveBeenCalledWith(body.token);
    });

    it('should parse the light-request', async () => {
      // action
      await controller.requestHandler(reqMock, resMock, body);

      // expect
      expect(eidasProviderServiceMock.parseLightRequest).toHaveBeenCalledTimes(
        1,
      );
      expect(eidasProviderServiceMock.parseLightRequest).toHaveBeenCalledWith(
        lightRequestMock,
      );
    });

    it('should put the eidas request in session', async () => {
      // action
      await controller.requestHandler(reqMock, resMock, body);

      // expect
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'EidasProvider',
        'eidasRequest',
        eidasRequestMock,
      );
    });

    it('should retrieve the redirectAfterRequestHandlingUrl from the config', async () => {
      // action
      await controller.requestHandler(reqMock, resMock, body);

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasProvider');
    });

    it('should return the redirectAfterRequestHandlingUrl with a 302 statusCode', async () => {
      // setup
      const expected = {
        statusCode: 302,
        url: configMock.redirectAfterRequestHandlingUrl,
      };

      // action
      const result = await controller.requestHandler(reqMock, resMock, body);

      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('responseProxy', () => {
    const partialEidasResponseMock = {
      status: {
        failure: false,
      },
    };
    const getEidasSessionMock = jest.fn();
    const eidasResponseMock = {
      id: '42691337',
      ...partialEidasResponseMock,
    };
    const formattedLightResponseMock = {
      lightResponse:
        "<LightResponse>If you believe, you'll see</LightResponse>",
      token: 'IlNhYmF0b24gLSBUaGUgTG9zdCBCYXR0YWxpb24iIC0+IExpc3Rlbg==',
    };

    beforeEach(() => {
      controller['getEidasResponse'] =
        getEidasSessionMock.mockResolvedValueOnce(eidasResponseMock);

      eidasProviderServiceMock.prepareLightResponse.mockReturnValueOnce(
        formattedLightResponseMock,
      );
    });

    it('should get the proxyServiceResponseCacheUrl from the configuration', async () => {
      // action
      await controller.responseProxy(reqMock, sessionServiceMock);

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('EidasProvider');
    });

    it('should prepare the light response using the eidasReponse', async () => {
      // action
      await controller.responseProxy(reqMock, sessionServiceMock);

      // expect
      expect(
        eidasProviderServiceMock.prepareLightResponse,
      ).toHaveBeenCalledTimes(1);
      expect(
        eidasProviderServiceMock.prepareLightResponse,
      ).toHaveBeenCalledWith(eidasResponseMock);
    });

    it('should write the light-response to the cache', async () => {
      // action
      await controller.responseProxy(reqMock, sessionServiceMock);

      // expect
      expect(
        eidasProviderServiceMock.writeLightResponseInCache,
      ).toHaveBeenCalledTimes(1);
      expect(
        eidasProviderServiceMock.writeLightResponseInCache,
      ).toHaveBeenCalledWith(
        eidasResponseMock.id,
        formattedLightResponseMock.lightResponse,
      );
    });

    it('should return the proxyServiceResponseCacheUrl and the token corresponding to the ligh-response', async () => {
      // action
      const expected = {
        proxyServiceResponseCacheUrl: configMock.proxyServiceResponseCacheUrl,
        token: formattedLightResponseMock.token,
      };
      const result = await controller.responseProxy(
        reqMock,
        sessionServiceMock,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getEidasResponse', () => {
    const partialEidasResponseMock = {
      status: {
        failure: false,
      },
    };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue({
        eidasRequest: eidasRequestMock,
        partialEidasResponse: partialEidasResponseMock,
      });
    });

    it('should get the eidas request and the partial eidas response from the session', async () => {
      // action
      await controller['getEidasResponse'](sessionServiceMock);

      // expect
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('should call completeFcSuccessResponse with the partialEidasResponse and the eidasRequest if the status failure is false', async () => {
      // action
      await controller['getEidasResponse'](sessionServiceMock);

      // expect
      expect(
        eidasProviderServiceMock.completeFcSuccessResponse,
      ).toHaveBeenCalledTimes(1);
      expect(
        eidasProviderServiceMock.completeFcSuccessResponse,
      ).toHaveBeenCalledWith(partialEidasResponseMock, eidasRequestMock);
    });

    it('should call completeFcFailureResponse with the partialEidasResponse and the eidasRequest if the status failure is true', async () => {
      // setup
      const partialFailureEidasResponseMock = {
        status: {
          failure: true,
        },
      };
      sessionServiceMock.get.mockReturnValueOnce({
        eidasRequest: eidasRequestMock,
        partialEidasResponse: partialFailureEidasResponseMock,
      });
      const eidasFailureResponseMock = {
        id: '42691337',
        ...partialFailureEidasResponseMock,
      };
      eidasProviderServiceMock.completeFcFailureResponse.mockReturnValueOnce(
        eidasFailureResponseMock,
      );

      // action
      await controller['getEidasResponse'](sessionServiceMock);

      // expect
      expect(
        eidasProviderServiceMock.completeFcFailureResponse,
      ).toHaveBeenCalledTimes(1);
      expect(
        eidasProviderServiceMock.completeFcFailureResponse,
      ).toHaveBeenCalledWith(partialFailureEidasResponseMock, eidasRequestMock);
    });
  });
});
