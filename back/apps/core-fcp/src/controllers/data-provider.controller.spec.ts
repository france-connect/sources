import { Request, Response } from 'express';

import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ChecktokenRequestDto } from '@fc/core';
import {
  DataProviderAdapterMongoService,
  DataProviderMetadata,
} from '@fc/data-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { RnippPivotIdentity } from '@fc/rnipp';
import { TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpSession } from '../dto';
import { DataProviderExceptionFilter } from '../filters';
import { DataProviderService } from '../services';
import { DataProviderController } from './data-provider.controller';

describe('DataProviderController', () => {
  let dataProviderController: DataProviderController;

  const dataProviderServiceMock = {
    checkRequestValid: jest.fn(),
    generateJwt: jest.fn(),
    generateTokenIntrospection: jest.fn(),
    getSessionByAccessToken: jest.fn(),
    getAccessTokenExp: jest.fn(),
    generateDataProviderSub: jest.fn(),
    generateErrorMessage: jest.fn(),
  };

  const dataProviderAdapterMongoMock = {
    getAuthenticatedDataProvider: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  const oidcSessionServiceMock = getSessionServiceMock();

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      DP_VERIFIED_FC_CHECKTOKEN: {},
      DP_USED_INVALID_ACCESS_TOKEN: {},
      DP_USED_INVALID_CREDENTIAL: {},
    },
  } as unknown as TrackingService;

  const tokenIntrospectionMock = {
    active: true,
    scope: 'scope',
  };

  const expiredTokenIntrospectionMock = {
    active: false,
  };

  const dpMock = {
    uid: 'dp-uid',
    title: 'data provider title',
    client_id: 'client_id',
  } as DataProviderMetadata;

  const reqMock = {
    foo: 'bar',
  } as unknown as Request;

  const sessionDataMock = {
    OidcClient: {
      accountId: 'accountId',
      browsingSessionId: 'browsingSessionId',
      idpId: 'idpId',
      idpName: 'idpName',
      idpLabel: 'idpLabel',
      spId: 'spId',
      spName: 'spName',
    },
  };

  const exceptionFilterMock = {
    catch: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataProviderController],
      providers: [
        DataProviderAdapterMongoService,
        DataProviderService,
        LoggerService,
        TrackingService,
      ],
    })
      .overrideFilter(DataProviderExceptionFilter)
      .useValue(exceptionFilterMock)
      .overrideProvider(DataProviderAdapterMongoService)
      .useValue(dataProviderAdapterMongoMock)
      .overrideProvider(DataProviderService)
      .useValue(dataProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    dataProviderController = module.get<DataProviderController>(
      DataProviderController,
    );
    dataProviderServiceMock.checkRequestValid.mockReturnValue(true);
    dataProviderAdapterMongoMock.getAuthenticatedDataProvider.mockReturnValue(
      dpMock,
    );
  });

  it('should be defined', () => {
    expect(dataProviderController).toBeDefined();
  });

  describe('checktoken', () => {
    const bodyMock: ChecktokenRequestDto = {
      token: 'acces_token',
      client_id: 'client_id',
      client_secret: 'client_secret',
    };

    const resMock = {
      set: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;

    const jwtMock = Symbol('jwtMock');

    const expMock = 1;
    const rnippIdentityMock = Symbol(
      'rnippIdentityMock',
    ) as unknown as RnippPivotIdentity;
    const spScopeMock = ['openid', 'gender', 'given_name'];
    const subMock = 'subMock';
    const trackingContext = { tracking: 'context' };

    beforeEach(() => {
      dataProviderServiceMock.checkRequestValid.mockResolvedValue(true);
      dataProviderServiceMock.generateDataProviderSub.mockReturnValue(subMock);
      dataProviderServiceMock.generateTokenIntrospection.mockReturnValue(
        tokenIntrospectionMock,
      );
      dataProviderServiceMock.generateJwt.mockReturnValue(jwtMock);
      dataProviderAdapterMongoMock.getAuthenticatedDataProvider.mockReturnValue(
        dpMock,
      );
      dataProviderServiceMock.getSessionByAccessToken = jest
        .fn()
        .mockReturnValue(sessionDataMock);
      dataProviderServiceMock.getAccessTokenExp = jest
        .fn()
        .mockReturnValue(expMock);

      jest.mocked(oidcSessionServiceMock.get).mockReturnValue({
        rnippIdentity: rnippIdentityMock,
        spScope: spScopeMock,
      });
      jest.mocked(resMock.status).mockReturnValue(resMock);

      dataProviderController['getTrackingContext'] = jest
        .fn()
        .mockReturnValue(trackingContext);
    });

    it('should check if request is valid', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(dataProviderServiceMock.checkRequestValid).toHaveBeenCalledTimes(
        1,
      );
      expect(dataProviderServiceMock.checkRequestValid).toHaveBeenCalledWith(
        bodyMock,
      );
    });

    it('should authenticate the data provider', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(
        dataProviderAdapterMongoMock.getAuthenticatedDataProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderAdapterMongoMock.getAuthenticatedDataProvider,
      ).toHaveBeenCalledWith(bodyMock.client_id, bodyMock.client_secret);
    });

    it('should get the session given the access token', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(
        dataProviderServiceMock.getSessionByAccessToken,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderServiceMock.getSessionByAccessToken,
      ).toHaveBeenCalledWith(bodyMock.token);
    });

    it('should call dataProvider.generateIntrospectionToken with the right parameters', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);
      // Then
      expect(
        dataProviderServiceMock.generateTokenIntrospection,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderServiceMock.generateTokenIntrospection,
      ).toHaveBeenCalledWith(sessionDataMock, bodyMock.token, dpMock);
    });

    it('should call generateJwt with the right parameters', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);
      // Then
      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledTimes(1);
      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledWith(
        tokenIntrospectionMock,
        dpMock,
      );
    });

    it('should call trackChecktokenJWT', async () => {
      // Given
      dataProviderController['trackChecktokenJWT'] = jest.fn();

      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(
        dataProviderController['trackChecktokenJWT'],
      ).toHaveBeenCalledTimes(1);
      expect(dataProviderController['trackChecktokenJWT']).toHaveBeenCalledWith(
        tokenIntrospectionMock,
        trackingContext,
      );
    });

    it('should set HTTP code 200', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should send the JWT', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(resMock.end).toHaveBeenCalledTimes(1);
      expect(resMock.end).toHaveBeenCalledWith(jwtMock);
    });
  });

  describe('getTrackingContext', () => {
    it('should return the right tracking context', () => {
      // Given
      const userSessionMock = {
        OidcClient: {
          accountId: 'accountId',
          browsingSessionId: 'browsingSessionId',
          idpId: 'idpId',
          idpName: 'idpName',
          idpLabel: 'idpLabel',
          spId: 'spId',
          spName: 'spName',
          spAcr: 'spAcr',
        },
      } as unknown as CoreFcpSession;

      // When
      const trackingContext = dataProviderController['getTrackingContext'](
        reqMock,
        dpMock,
        userSessionMock,
      );

      // Then
      expect(trackingContext).toEqual({
        req: reqMock,
        dpId: dpMock.uid,
        dpTitle: dpMock.title,
        ...userSessionMock.OidcClient,
      });
    });
  });

  describe('trackChecktokenJWT()', () => {
    it('should emit DP_VERIFIED_FC_CHECKTOKEN event if token_introspection is active', async () => {
      // When
      await dataProviderController['trackChecktokenJWT'](
        tokenIntrospectionMock,
        {
          req: reqMock,
        },
      );

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.DP_VERIFIED_FC_CHECKTOKEN,
        { req: reqMock, scope: 'scope' },
      );
    });

    it('should emit DP_USED_INVALID_ACCESS_TOKEN event if token_introspection is not active', async () => {
      // When
      await dataProviderController['trackChecktokenJWT'](
        expiredTokenIntrospectionMock,
        {
          req: reqMock,
        },
      );

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.DP_USED_INVALID_ACCESS_TOKEN,
        { req: reqMock },
      );
    });
  });
});
