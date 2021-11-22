import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { LoggerService } from '@fc/logger';
import {
  OidcProviderAuthorizeParamsException,
  OidcProviderService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

const sessionServiceMock = {
  reset: jest.fn(),
};

const nextMock = jest.fn();

const loggerServiceMock = {
  debug: jest.fn(),
  setContext: jest.fn(),
  trace: jest.fn(),
} as unknown as LoggerService;

const reqMock = Symbol('req');
const resMock = Symbol('res');
const queryErrorMock = {
  error: 'error',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_description: 'errorDescription',
};
const validatorOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  whitelist: true,
};
const queryMock = {} as AuthorizeParamsDto;
const bodyMock = {} as AuthorizeParamsDto;

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;
  let validateDtoMock;

  const oidcProviderServiceMock = {
    abortInteraction: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [LoggerService, OidcProviderService, SessionService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    oidcProviderController = await app.get<OidcProviderController>(
      OidcProviderController,
    );

    validateDtoMock = mocked(validateDto, true);

    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('getAuthorize()', () => {
    it('should call next', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await oidcProviderController.getAuthorize(
        reqMock,
        resMock,
        nextMock,
        queryMock,
      );

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        queryMock,
        AuthorizeParamsDto,
        validatorOptions,
      );
      expect(nextMock).toHaveReturnedTimes(1);
    });

    it('should throw an Error if DTO not validated', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([{ property: 'invalid param' }]);

      // Then
      expect(
        async () =>
          await oidcProviderController.getAuthorize(
            reqMock,
            resMock,
            nextMock,
            queryMock,
          ),
      ).rejects.toThrow(OidcProviderAuthorizeParamsException);
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        queryMock,
        AuthorizeParamsDto,
        validatorOptions,
      );
      expect(nextMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('postAuthorize()', () => {
    it('should call next', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await oidcProviderController.postAuthorize(
        reqMock,
        resMock,
        nextMock,
        bodyMock,
      );

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        bodyMock,
        AuthorizeParamsDto,
        validatorOptions,
      );
      expect(nextMock).toHaveReturnedTimes(1);
    });

    it('should throw an Error if DTO not validated', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([{ property: 'invalid param' }]);

      // Then
      expect(
        async () =>
          await oidcProviderController.postAuthorize(
            reqMock,
            resMock,
            nextMock,
            bodyMock,
          ),
      ).rejects.toThrow(OidcProviderAuthorizeParamsException);
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        bodyMock,
        AuthorizeParamsDto,
        validatorOptions,
      );
    });
  });

  describe('redirectToSpWithError', () => {
    it('should call abortInteraction', async () => {
      // When
      await oidcProviderController.redirectToSpWithError(
        queryErrorMock,
        reqMock,
        resMock,
      );

      // Then
      expect(oidcProviderServiceMock.abortInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.abortInteraction).toHaveBeenCalledWith(
        reqMock,
        resMock,
        'error',
        'errorDescription',
      );
    });

    it('should throw an error', async () => {
      // Given
      oidcProviderServiceMock.abortInteraction.mockRejectedValueOnce(
        'Une erreur est survenu.',
      );

      // Then
      await expect(
        oidcProviderController.redirectToSpWithError(
          queryErrorMock,
          reqMock,
          resMock,
        ),
      ).rejects.toThrow(Error);
    });
  });
});
