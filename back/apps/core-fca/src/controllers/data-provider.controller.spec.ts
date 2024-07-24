import { Request, Response } from 'express';

import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  ChecktokenRequestDto,
  InvalidChecktokenRequestException,
} from '@fc/core';
import {
  DataProviderAdapterMongoService,
  DataProviderMetadata,
} from '@fc/data-provider-adapter-mongo';
import { DataProviderInvalidCredentialsException } from '@fc/data-provider-adapter-mongo/exceptions';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { DataProviderService } from '../services';
import { DataProviderController } from './data-provider.controller';

const spIdentityMock = {
  given_name: 'Edward',
  family_name: 'TEACH',
  email: 'eteach@fqdn.ext',
};

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

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataProviderController],
      providers: [
        DataProviderAdapterMongoService,
        DataProviderService,
        LoggerService,
      ],
    })
      .overrideProvider(DataProviderAdapterMongoService)
      .useValue(dataProviderAdapterMongoMock)
      .overrideProvider(DataProviderService)
      .useValue(dataProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
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

    const spScopeMock = ['openid', 'gender', 'given_name'];
    const subMock = 'subMock';

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
        spIdentity: spIdentityMock,
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
        error_description: 'Client authentication failed.',
      });
    });

    it('should return HTTP code 400 and send error message when checkRequest method failed', async () => {
      // Given
      dataProviderServiceMock.checkRequestValid.mockRejectedValue(
        new InvalidChecktokenRequestException(),
      );
      dataProviderServiceMock.generateErrorMessage.mockReturnValueOnce({
        error: 'invalid_request',
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
        error_description: 'Required parameter missing or invalid.',
      });
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
    });

    it('should return HTTP code 500 and send error message if no httpStatusCode', async () => {
      // Given
      dataProviderServiceMock.checkRequestValid.mockRejectedValue(new Error());
      dataProviderServiceMock.generateErrorMessage.mockReturnValueOnce({
        error: 'server_error',
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
        error_description:
          'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
      });
    });

    it('should return expired JWT if session is not found', async () => {
      // Given
      dataProviderServiceMock.getSessionByAccessToken.mockReturnValueOnce(null);
      dataProviderServiceMock.generateTokenIntrospection.mockReturnValueOnce(
        expiredTokenIntrospectionMock,
      );

      // When
      await dataProviderController.checktoken(reqMock, resMock, bodyMock);

      // Then
      expect(
        dataProviderServiceMock.generateTokenIntrospection,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderServiceMock.generateTokenIntrospection,
      ).toHaveBeenCalledWith(null, bodyMock.token, dpMock);

      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledTimes(1);
      expect(dataProviderServiceMock.generateJwt).toHaveBeenCalledWith(
        expiredTokenIntrospectionMock,
        dpMock,
      );
    });
  });
});
