import { Response } from 'express';

import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DataProviderAdapterMongoService } from '@fc/data-provider-adapter-mongo';
import { DataProviderInvalidCredentialsException } from '@fc/data-provider-adapter-mongo/exceptions';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { RnippPivotIdentity } from '@fc/rnipp';
import { ISessionRequest, ISessionService, SessionService } from '@fc/session';

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
  };

  const dataProviderAdapterMongoMock = {
    checkAuthentication: jest.fn(),
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const sessionServiceMock = {
    attach: jest.fn(),
  } as unknown as SessionService;

  const oidcSessionServiceMock = {
    get: jest.fn(),
  } as unknown as ISessionService<OidcClientSession>;

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
      .compile();

    dataProviderController = module.get<DataProviderController>(
      DataProviderController,
    );
    dataProviderServiceMock.checkRequestValid.mockReturnValue(true);
    dataProviderAdapterMongoMock.checkAuthentication.mockReturnValue(true);
  });

  it('should be defined', () => {
    expect(dataProviderController).toBeDefined();
  });

  describe('checktoken', () => {
    const reqMock = {
      foo: 'bar',
    } as unknown as ISessionRequest;

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
      status: jest.fn(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    const sessionIdMock = 'testSessionId';

    const payloadMock = {};
    const jwtMock = Symbol('jwtMock');

    const expMock = 1;
    const rnippIdentityMock = Symbol(
      'rnippIdentityMock',
    ) as unknown as RnippPivotIdentity;
    const spScopeMock = ['openid', 'gender', 'given_name'];
    const subMock = 'subMock';

    beforeEach(() => {
      dataProviderServiceMock.checkRequestValid.mockReturnValue(true);
      dataProviderServiceMock.generateDataProviderSub.mockReturnValue(subMock);
      dataProviderServiceMock.generatePayload.mockReturnValue(payloadMock);
      dataProviderServiceMock.generateJwt.mockReturnValue(jwtMock);
      dataProviderAdapterMongoMock.checkAuthentication.mockResolvedValue(
        Promise.resolve(),
      );
      dataProviderServiceMock.getSessionByAccessToken = jest
        .fn()
        .mockReturnValue(sessionIdMock);
      dataProviderServiceMock.getAccessTokenExp = jest
        .fn()
        .mockReturnValue(expMock);
      jest
        .spyOn(SessionService, 'getBoundSession')
        .mockReturnValue(oidcSessionServiceMock);
      jest.mocked(oidcSessionServiceMock.get).mockResolvedValue({
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
        dataProviderAdapterMongoMock.checkAuthentication,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderAdapterMongoMock.checkAuthentication,
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

    it('should set sessionId and sessionService on req', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(reqMock.sessionId).toEqual(sessionIdMock);
      expect(reqMock.sessionService).toEqual(sessionServiceMock);
    });

    it('should get the session service bound to sessionId', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledTimes(1);
      expect(SessionService.getBoundSession).toHaveBeenCalledWith(
        reqMock,
        'OidcClient',
      );
    });

    it('should call dataProvider.generatePayload with the right parameters', async () => {
      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);
      // Then
      expect(dataProviderServiceMock.generatePayload).toHaveBeenCalledTimes(1);
      expect(dataProviderServiceMock.generatePayload).toHaveBeenCalledWith(
        oidcSessionServiceMock,
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
      expect(resMock.send).toHaveBeenCalledTimes(1);
      expect(resMock.send).toHaveBeenCalledWith(jwtMock);
    });

    it('should return HTTP code 401 and send error message when checkAuthentication method failed', async () => {
      dataProviderServiceMock.checkRequestValid.mockResolvedValueOnce(true);
      dataProviderAdapterMongoMock.checkAuthentication.mockRejectedValueOnce(
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
    });

    it('should return HTTP code 400 and send error message when checkRequest method failed', async () => {
      // Given
      dataProviderServiceMock.checkRequestValid.mockRejectedValue(
        new InvalidChecktokenRequestException(),
      );

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
    });

    it('should return expired JWT if session is not found', async () => {
      // Given
      dataProviderServiceMock.getSessionByAccessToken.mockReturnValueOnce(
        undefined,
      );
      const expiredPayload = Symbol('Expired paylad');
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
    });
  });
});
