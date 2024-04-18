import { Request, Response } from 'express';

import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  DataProviderAdapterMongoService,
  DataProviderMetadata,
} from '@fc/data-provider-adapter-mongo';
import { DataProviderInvalidCredentialsException } from '@fc/data-provider-adapter-mongo/exceptions';
import { LoggerService } from '@fc/logger';
import { RnippPivotIdentity } from '@fc/rnipp';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { ChecktokenRequestDto } from '../dto';
import { InvalidChecktokenRequestException } from '../exceptions';
import { DataProviderService } from '../services';
import { DataProviderController } from './data-provider.controller';

describe('DataProviderController', () => {
  let dataProviderController: DataProviderController;

  const dataProviderServiceMock = {
    checkRequestValid: jest.fn(),
    generateJwt: jest.fn(),
    generatePayload: jest.fn(),
    getSessionByAccessToken: jest.fn(),
    getAccessTokenExp: jest.fn(),
    generateDataProviderSub: jest.fn(),
    generateExpiredPayload: jest.fn(),
    generateErrorMessage: jest.fn(),
  };

  const dataProviderAdapterMongoMock = {
    getAuthenticatedDataProvider: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  const oidcSessionServiceMock = getSessionServiceMock();
  const sessionServiceMock = getSessionServiceMock();

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      DP_VERIFIED_FC_CHECKTOKEN: {},
      DP_USED_INVALID_ACCESS_TOKEN: {},
      DP_USED_INVALID_CREDENTIAL: {},
    },
  } as unknown as TrackingService;

  const payloadMock = {
    // oidc naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_introspection: {
      active: true,
      scope: 'scope',
    },
  };

  const expiredPayload = {
    // oidc naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_introspection: {
      active: false,
    },
  };

  const dpMock = {
    uid: 'dp-uid',
    title: 'data provider title',
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

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataProviderController],
      providers: [
        DataProviderAdapterMongoService,
        DataProviderService,
        LoggerService,
        SessionService,
        TrackingService,
      ],
    })
      .overrideProvider(DataProviderAdapterMongoService)
      .useValue(dataProviderAdapterMongoMock)
      .overrideProvider(DataProviderService)
      .useValue(dataProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
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
    sessionServiceMock.getDataFromBackend.mockResolvedValue(sessionDataMock);
  });

  it('should be defined', () => {
    expect(dataProviderController).toBeDefined();
  });

  describe('checktoken', () => {
    const bodyMock: ChecktokenRequestDto = {
      // oidc compliant
      // eslint-disable-next-line @typescript-eslint/naming-convention
      access_token: 'acces_token',
      // oidc compliant
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'client_id',
      // oidc compliant
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: 'client_secret',
    };

    const resMock = {
      set: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;

    const sessionIdMock = 'testSessionId';

    const jwtMock = Symbol('jwtMock');

    const expMock = 1;
    const rnippIdentityMock = Symbol(
      'rnippIdentityMock',
    ) as unknown as RnippPivotIdentity;
    const spScopeMock = ['openid', 'gender', 'given_name'];
    const subMock = 'subMock';

    beforeEach(() => {
      dataProviderServiceMock.checkRequestValid.mockResolvedValue(true);
      dataProviderServiceMock.generateDataProviderSub.mockReturnValue(subMock);
      dataProviderServiceMock.generatePayload.mockReturnValue(payloadMock);
      dataProviderServiceMock.generateJwt.mockReturnValue(jwtMock);
      dataProviderAdapterMongoMock.getAuthenticatedDataProvider.mockResolvedValue(
        dpMock,
      );
      dataProviderServiceMock.getSessionByAccessToken = jest
        .fn()
        .mockReturnValue(sessionIdMock);
      dataProviderServiceMock.getAccessTokenExp = jest
        .fn()
        .mockReturnValue(expMock);

      jest.mocked(oidcSessionServiceMock.get).mockReturnValue({
        rnippIdentity: rnippIdentityMock,
        spScope: spScopeMock,
      });
      jest.mocked(resMock.status).mockReturnValue(resMock);
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
      ).toHaveBeenCalledWith(bodyMock.access_token);
    });

    it('should call dataProvider.generatePayload with the right parameters', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);
      // Then
      expect(dataProviderServiceMock.generatePayload).toHaveBeenCalledTimes(1);
      expect(dataProviderServiceMock.generatePayload).toHaveBeenCalledWith(
        sessionDataMock,
        bodyMock.access_token,
        bodyMock.client_id,
      );
    });

    it('should call generateJwt with the right parameters', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);
      // Then
      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledTimes(1);
      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledWith(
        payloadMock,
        bodyMock.client_id,
      );
    });

    it('should set the header application/token-introspection+jwt', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(resMock.set).toHaveBeenCalledTimes(1);
      expect(resMock.set).toHaveBeenCalledWith(
        'Content-Type',
        'application/token-introspection+jwt',
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
        payloadMock,
        {
          req: reqMock,
          dpId: 'dp-uid',
          dpTitle: 'data provider title',
          ...sessionDataMock.OidcClient,
        },
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

    it('should return HTTP code 401 and send error message when getAuthenticatedDataProvider method failed', async () => {
      dataProviderServiceMock.checkRequestValid.mockResolvedValueOnce(true);
      dataProviderServiceMock.generateErrorMessage.mockReturnValueOnce({
        error: 'invalid_client',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Client authentication failed.',
      });
      dataProviderAdapterMongoMock.getAuthenticatedDataProvider.mockRejectedValueOnce(
        new DataProviderInvalidCredentialsException(),
      );

      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'invalid_client',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Client authentication failed.',
      });

      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.DP_USED_INVALID_CREDENTIAL,
        { req: reqMock, dpClientId: bodyMock.client_id },
      );
    });

    it('should return HTTP code 400 and send error message when checkRequest method failed', async () => {
      // Given
      dataProviderServiceMock.checkRequestValid.mockRejectedValue(
        new InvalidChecktokenRequestException(),
      );
      dataProviderServiceMock.generateErrorMessage.mockReturnValueOnce({
        error: 'invalid_request',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Required parameter missing or invalid.',
      });

      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'invalid_request',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Required parameter missing or invalid.',
      });

      expect(trackingServiceMock.track).toHaveBeenCalledTimes(0);
    });

    it('should log a critical error if a catch happens', async () => {
      // Given
      const errorMock = new Error('test');
      dataProviderServiceMock.checkRequestValid.mockRejectedValue(errorMock);

      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(loggerServiceMock.crit).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.crit).toHaveBeenCalledWith(
        { error: '' },
        errorMock.message,
      );

      expect(trackingServiceMock.track).toHaveBeenCalledTimes(0);
    });

    it('should return HTTP code 500 and send error message if no httpStatusCode', async () => {
      // Given
      dataProviderServiceMock.checkRequestValid.mockRejectedValue(new Error());
      dataProviderServiceMock.generateErrorMessage.mockReturnValueOnce({
        error: 'server_error',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description:
          'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
      });

      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'server_error',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description:
          'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
      });

      expect(trackingServiceMock.track).toHaveBeenCalledTimes(0);
    });

    it('should return expired JWT if session is not found', async () => {
      // Given
      dataProviderController['trackChecktokenJWT'] = jest.fn();
      dataProviderServiceMock.getSessionByAccessToken.mockReturnValueOnce(
        undefined,
      );
      dataProviderServiceMock.generateExpiredPayload.mockReturnValueOnce(
        expiredPayload,
      );

      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(
        dataProviderServiceMock.generateExpiredPayload,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderServiceMock.generateExpiredPayload,
      ).toHaveBeenCalledWith(bodyMock.client_id);

      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledTimes(1);
      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledWith(
        expiredPayload,
        bodyMock.client_id,
      );

      expect(
        dataProviderController['trackChecktokenJWT'],
      ).toHaveBeenCalledTimes(1);
      expect(dataProviderController['trackChecktokenJWT']).toHaveBeenCalledWith(
        expiredPayload,
        { req: reqMock, dpId: 'dp-uid', dpTitle: 'data provider title' },
      );
    });
  });

  describe('trackChecktokenJWT()', () => {
    it('should emit DP_VERIFIED_FC_CHECKTOKEN event if token_introspection is active', async () => {
      // When
      await dataProviderController['trackChecktokenJWT'](payloadMock, {
        req: reqMock,
      });

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.DP_VERIFIED_FC_CHECKTOKEN,
        { req: reqMock, scope: 'scope' },
      );
    });

    it('should emit DP_USED_INVALID_ACCESS_TOKEN event if token_introspection is not active', async () => {
      // When
      await dataProviderController['trackChecktokenJWT'](expiredPayload, {
        req: reqMock,
      });

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.DP_USED_INVALID_ACCESS_TOKEN,
        { req: reqMock },
      );
    });
  });
});
