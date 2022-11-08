import { Response } from 'express';
import { mocked } from 'jest-mock';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import { PartnerAccountService } from '@fc/partner-account';

import { AccountController } from './account.controller';

describe('AccountController', () => {
  let controller: AccountController;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  };

  const accountServiceMock = {
    findByEmail: jest.fn(),
  };

  const sessionPartnerAccountMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [PartnerAccountService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnerAccountService)
      .useValue(accountServiceMock)
      .compile();

    controller = app.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCSRF', () => {
    const resMock = {
      status: jest.fn(),
      json: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
      mocked(resMock.status).mockReturnValue(resMock);
    });

    const csrfMock = { csrfToken: 'any_valid_csrf_token' };

    it('should call res.json', async () => {
      // When
      await controller.getCSRF(resMock);

      // Then
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith(csrfMock);
    });
  });

  describe('getUserInfos', () => {
    const firstname = 'firstnameValue';
    const lastname = 'lastnameValue';
    const resMock = {
      status: jest.fn(),
      json: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;
    const userInfos = {
      firstname,
      lastname,
    };

    beforeEach(() => {
      mocked(resMock.status).mockReturnValue(resMock);
    });

    it('should call sessionPartnerAccountMock.get', async () => {
      // Given
      sessionPartnerAccountMock.get.mockResolvedValueOnce(userInfos);

      // When
      await controller.getUserInfos(resMock, sessionPartnerAccountMock);

      // Then
      expect(sessionPartnerAccountMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call res.json', async () => {
      // Given
      sessionPartnerAccountMock.get.mockResolvedValueOnce(userInfos);

      // When
      await controller.getUserInfos(resMock, sessionPartnerAccountMock);

      // Then
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith({ firstname, lastname });
    });

    it('should call res.status', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      sessionPartnerAccountMock.get.mockRejectedValueOnce(errorMock);

      // When
      await controller.getUserInfos(resMock, sessionPartnerAccountMock);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(403);
    });
  });

  describe('login', () => {
    const bodyMock = {
      email: 'email@value.fr',
      password: 'passwordValue',
    };

    const userMock = {
      firstname: 'firstnameValue',
      lastname: 'lastnameValue',
      email: 'emailValue',
      createdAt: 'createdAtValue',
      updatedAt: 'updatedAt',
      id: 'idValue',
    };

    beforeEach(() => {
      accountServiceMock.findByEmail.mockResolvedValueOnce(userMock);
    });

    it('should call accountService.findByEmail()', async () => {
      // When
      await controller.login(bodyMock, sessionPartnerAccountMock);

      // Then
      expect(accountServiceMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(accountServiceMock.findByEmail).toHaveBeenCalledWith(
        bodyMock.email,
      );
    });

    it('should call sessionPartnerAccount', async () => {
      // When
      await controller.login(bodyMock, sessionPartnerAccountMock);

      // Then
      expect(sessionPartnerAccountMock.set).toHaveBeenCalledTimes(1);
      expect(sessionPartnerAccountMock.set).toHaveBeenCalledWith(userMock);
    });

    it('should return partners service login function value', async () => {
      // When
      const result = await controller.login(
        bodyMock,
        sessionPartnerAccountMock,
      );

      // Then
      expect(result).toStrictEqual(userMock);
    });
  });
});
