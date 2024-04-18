import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CoreMissingIdentityException } from '@fc/core';
import { CsrfTokenGuard } from '@fc/csrf';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import {
  OidcProviderAuthorizeParamsException,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { AuthorizeParamsDto } from '../dto';
import { ConfirmationType, DataType } from '../enums';
import { CoreFcpInvalidEventKeyException } from '../exceptions';
import { CoreFcpService } from '../services';
import { OidcProviderController } from './oidc-provider.controller';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

const sessionServiceMock = getSessionServiceMock();

const coreSessionServiceMock = getSessionServiceMock();

const nextMock = jest.fn();

const loggerServiceMock = getLoggerMock();

const reqMock = Symbol('req');
const resMock = {
  locals: {},
};

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

const serviceProviderMock = {
  name: 'spName mocked value',
};

const sessionIdMock = 'session-id-mock';

const serviceProviderServiceMock = {
  getById: jest.fn(),
};

const trackingServiceMock = {
  track: jest.fn(),
  TrackedEventsMap: {
    FC_DATATRANSFER_CONSENT_IDENTITY: {},
    FC_DATATRANSFER_INFORMATION_IDENTITY: {},
    FC_DATATRANSFER_INFORMATION_ANONYMOUS: {},
  },
};

const coreServiceMock = {
  getClaimsForInteraction: jest.fn(),
  getClaimsLabelsForInteraction: jest.fn(),
  getFeature: jest.fn(),
  getScopesForInteraction: jest.fn(),
  isConsentRequired: jest.fn(),
  sendAuthenticationMail: jest.fn(),
  verify: jest.fn(),
};

const res = {
  redirect: jest.fn(),
  render: jest.fn(),
} as unknown as Response;

const configServiceMock = {
  get: jest.fn(),
};

const interactionIdMock = 'interactionIdMockValue';
const acrMock = 'acrMockValue';
const spNameMock = 'some SP';
const spIdMock = 'spIdMockValue';
const idpStateMock = 'idpStateMockValue';
const idpNonceMock = 'idpNonceMock';
const idpIdMock = 'idpIdMockValue';
const randomStringMock = 'randomStringMockValue';
const scopesMock = ['toto', 'titi'];
const claimsMock = ['foo', 'bar'];
const claimsLabelMock = ['F o o', 'B a r'];

const req = {
  fc: {
    interactionId: interactionIdMock,
  },
  query: {
    firstQueryParam: 'first',
    secondQueryParam: 'second',
  },
  params: {
    providerUid: 'secretProviderUid',
  },
} as unknown as Request;

const sessionDataMock: OidcSession = {
  idpId: idpIdMock,
  idpNonce: idpNonceMock,
  idpState: idpStateMock,
  interactionId: interactionIdMock,

  spAcr: acrMock,
  spId: spIdMock,
  spIdentity: {} as IOidcIdentity,
  spName: spNameMock,
};

const interactionDetailsResolved = {
  params: {
    scope: 'toto titi',
  },
  prompt: Symbol('prompt'),
  uid: Symbol('uid'),
};

const csrfGuardMock = {
  canActivate: jest.fn(),
};

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;
  let validateDtoMock;

  const oidcProviderServiceMock = {
    abortInteraction: jest.fn(),
    getInteraction: jest.fn(),
    finishInteraction: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [
        LoggerService,
        OidcProviderService,
        SessionService,
        ServiceProviderAdapterMongoService,
        CoreFcpService,
        TrackingService,
        ConfigService,
      ],
    })
      .overrideGuard(CsrfTokenGuard)
      .useValue(csrfGuardMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(CoreFcpService)
      .useValue(coreServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    oidcProviderController = app.get<OidcProviderController>(
      OidcProviderController,
    );

    validateDtoMock = jest.mocked(validateDto);

    jest.resetAllMocks();
    jest.restoreAllMocks();

    serviceProviderServiceMock.getById.mockResolvedValueOnce(
      serviceProviderMock,
    );

    coreServiceMock.verify.mockResolvedValue(interactionDetailsResolved);
    coreServiceMock.getClaimsForInteraction.mockReturnValue(claimsMock);
    coreServiceMock.getScopesForInteraction.mockReturnValue(scopesMock);
    coreServiceMock.isConsentRequired.mockResolvedValue(true);
    coreServiceMock.getClaimsLabelsForInteraction.mockReturnValue(
      claimsLabelMock,
    );

    sessionServiceMock.reset.mockResolvedValueOnce(sessionIdMock);
    sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);
    sessionServiceMock.set.mockReturnValueOnce(undefined);

    coreSessionServiceMock.get.mockReturnValueOnce([]);

    configServiceMock.get.mockReturnValueOnce({
      enableSso: false,
    });

    resMock.locals = {};
  });

  describe('getAuthorize()', () => {
    it('should call next', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await oidcProviderController.getAuthorize(resMock, nextMock, queryMock);

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

    it('should call next (sso mode)', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);
      configServiceMock.get.mockReset().mockReturnValueOnce({
        enableSso: true,
      });

      // When
      await oidcProviderController.getAuthorize(resMock, nextMock, queryMock);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(0);
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        queryMock,
        AuthorizeParamsDto,
        validatorOptions,
      );
      expect(nextMock).toHaveReturnedTimes(1);
    });

    it('should expose spName to templates', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await oidcProviderController.getAuthorize(resMock, nextMock, queryMock);

      // Then
      expect(resMock.locals).toHaveProperty('spName');
      expect(resMock.locals['spName']).toEqual(serviceProviderMock.name);
    });

    it('should throw an Error if DTO not validated', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([{ property: 'invalid param' }]);
      // Then
      await expect(
        oidcProviderController.getAuthorize(resMock, nextMock, queryMock),
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
      await oidcProviderController.postAuthorize(resMock, nextMock, bodyMock);

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

    it('should expose spName to templates', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await oidcProviderController.getAuthorize(resMock, nextMock, queryMock);

      // Then
      expect(resMock.locals).toHaveProperty('spName');
      expect(resMock.locals['spName']).toEqual(serviceProviderMock.name);
    });

    it('should throw an Error if DTO not validated', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([{ property: 'invalid param' }]);

      // Then
      await expect(
        oidcProviderController.postAuthorize(resMock, nextMock, bodyMock),
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
        // oidc naming
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { error: 'error', error_description: 'errorDescription' },
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

  describe('isAnonymous()', () => {
    it('should return true if only openid is used as scope', () => {
      // Given
      const scopes = ['openid'];
      // When
      const result = oidcProviderController['isAnonymous'](scopes);
      // Then
      expect(result).toBe(true);
    });

    it('should return false if more scopes than just openid is used', () => {
      // Given
      const scopes = ['openid', 'gender'];
      // When
      const result = oidcProviderController['isAnonymous'](scopes);
      // Then
      expect(result).toBe(false);
    });
  });

  describe('getDataType()', () => {
    it('should return ANONYMOUS if isAnonymous parameter is true', () => {
      // Given
      const isAnonymous = true;
      // When
      const result = oidcProviderController['getDataType'](isAnonymous);
      // Then
      expect(result).toEqual(DataType.ANONYMOUS);
    });

    it('should return IDENTITY if isAnonymous parameter is false', () => {
      // Given
      const isAnonymous = false;
      // When
      const result = oidcProviderController['getDataType'](isAnonymous);
      // Then
      expect(result).toEqual(DataType.IDENTITY);
    });
  });

  describe('getConfirmationType()', () => {
    it('should return CONSENT if consentRequired parameter is true and isAnonymous is false', () => {
      // Given
      const consentRequired = true;
      const isAnonymous = false;
      // When
      const result = oidcProviderController['getConfirmationType'](
        consentRequired,
        isAnonymous,
      );
      // Then
      expect(result).toEqual(ConfirmationType.CONSENT);
    });

    it('should return INFORMATION if consentRequired parameter is false and isAnonymous is false', () => {
      // Given
      const consentRequired = false;
      const isAnonymous = false;
      // When
      const result = oidcProviderController['getConfirmationType'](
        consentRequired,
        isAnonymous,
      );
      // Then
      expect(result).toEqual(ConfirmationType.INFORMATION);
    });

    it('should return INFORMATION if consentRequired parameter is true and isAnonymous is true', () => {
      // Given
      const consentRequired = true;
      const isAnonymous = true;
      // When
      const result = oidcProviderController['getConfirmationType'](
        consentRequired,
        isAnonymous,
      );
      // Then
      expect(result).toEqual(ConfirmationType.INFORMATION);
    });
  });

  describe('getDataEvent()', () => {
    // Given
    const scopesMock = ['openid', 'profile'];
    const consentRequiredMock = false;
    const isAnonymousMock = false;

    beforeEach(() => {
      oidcProviderController['isAnonymous'] = jest
        .fn()
        .mockReturnValue(isAnonymousMock);
      oidcProviderController['getDataType'] = jest
        .fn()
        .mockReturnValue(DataType.IDENTITY);
      oidcProviderController['getConfirmationType'] = jest
        .fn()
        .mockReturnValue(ConfirmationType.INFORMATION);
    });

    it('should call isAnonymous', () => {
      // When
      oidcProviderController['getDataEvent'](scopesMock, consentRequiredMock);
      // Then
      expect(oidcProviderController['isAnonymous']).toHaveBeenCalledTimes(1);
      expect(oidcProviderController['isAnonymous']).toHaveBeenCalledWith(
        scopesMock,
      );
    });

    it('should call getDataType', () => {
      // When
      oidcProviderController['getDataEvent'](scopesMock, consentRequiredMock);
      // Then
      expect(oidcProviderController['getDataType']).toHaveBeenCalledTimes(1);
      expect(oidcProviderController['getDataType']).toHaveBeenCalledWith(
        isAnonymousMock,
      );
    });

    it('should call getConfirmationType', () => {
      // When
      oidcProviderController['getDataEvent'](scopesMock, consentRequiredMock);
      // Then
      expect(
        oidcProviderController['getConfirmationType'],
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcProviderController['getConfirmationType'],
      ).toHaveBeenCalledWith(consentRequiredMock, isAnonymousMock);
    });

    it('should return information for identity', () => {
      // Given / When
      const result = oidcProviderController['getDataEvent'](
        scopesMock,
        consentRequiredMock,
      );
      // Then
      expect(result).toEqual(
        trackingServiceMock.TrackedEventsMap
          .FC_DATATRANSFER_INFORMATION_IDENTITY,
      );
    });

    it('should return consent for identity', () => {
      // Given
      const consentRequiredMock = true;

      // When
      const result = oidcProviderController['getDataEvent'](
        scopesMock,
        consentRequiredMock,
      );
      // Then
      expect(result).toEqual(
        trackingServiceMock.TrackedEventsMap.FC_DATATRANSFER_CONSENT_IDENTITY,
      );
    });

    it('should return information for anonymous', () => {
      // Given
      const scopesMock = ['openid'];
      // When
      const result = oidcProviderController['getDataEvent'](
        scopesMock,
        consentRequiredMock,
      );
      // Then
      expect(result).toEqual(
        trackingServiceMock.TrackedEventsMap
          .FC_DATATRANSFER_INFORMATION_ANONYMOUS,
      );
    });

    it('should throw an exception if class is not in map', () => {
      // Given
      oidcProviderController['getDataType'] = jest
        .fn()
        .mockReset()
        .mockReturnValue('ANONYMOUS');
      oidcProviderController['getConfirmationType'] = jest
        .fn()
        .mockReset()
        .mockReturnValue('CONSENT');
      // Then
      expect(() =>
        oidcProviderController['getDataEvent'](scopesMock, consentRequiredMock),
      ).toThrow(CoreFcpInvalidEventKeyException);
      oidcProviderController['getDataType'] = jest.fn().mockReset();
      oidcProviderController['getConfirmationType'] = jest.fn().mockReset();
    });
  });

  describe('trackDatatransfer()', () => {
    // Given
    const contextMock = {};
    const interactionMock = {};
    const spIdMock = 'foo';
    const eventClassMock = 'foo';

    beforeEach(() => {
      oidcProviderController['getDataEvent'] = jest
        .fn()
        .mockReturnValue(eventClassMock);
    });

    it('should get scopes', async () => {
      // When
      await oidcProviderController['trackDatatransfer'](
        contextMock,
        interactionMock,
        spIdMock,
      );
      // Then
      expect(coreServiceMock.getScopesForInteraction).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.getScopesForInteraction).toHaveBeenCalledWith(
        interactionMock,
      );
    });

    it('should get claims', async () => {
      // When
      await oidcProviderController['trackDatatransfer'](
        contextMock,
        interactionMock,
        spIdMock,
      );
      // Then
      expect(coreServiceMock.getClaimsForInteraction).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.getClaimsForInteraction).toHaveBeenCalledWith(
        interactionMock,
      );
    });

    it('should get consent requirement', async () => {
      // When
      await oidcProviderController['trackDatatransfer'](
        contextMock,
        interactionMock,
        spIdMock,
      );
      // Then
      expect(coreServiceMock.isConsentRequired).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.isConsentRequired).toHaveBeenCalledWith(spIdMock);
    });

    it('should get data event', async () => {
      // When
      await oidcProviderController['trackDatatransfer'](
        contextMock,
        interactionMock,
        spIdMock,
      );
      // Then
      expect(oidcProviderController['getDataEvent']).toHaveBeenCalledTimes(1);
      expect(oidcProviderController['getDataEvent']).toHaveBeenCalledWith(
        scopesMock,
        true,
      );
    });

    it('should call tracking.track', async () => {
      // When
      await oidcProviderController['trackDatatransfer'](
        contextMock,
        interactionMock,
        spIdMock,
      );

      const sentContextMock = {
        ...contextMock,
        claims: claimsMock,
      };
      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        eventClassMock,
        sentContextMock,
      );
    });
  });

  describe('getLogin()', () => {
    beforeEach(() => {
      oidcProviderController['handleSessionLife'] = jest.fn();
    });

    it('should throw an exception if no identity in session', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockReturnValueOnce({
        csrfToken: randomStringMock,
        interactionId: interactionIdMock,
        spAcr: acrMock,
        spName: spNameMock,
      });

      // Then
      await expect(
        oidcProviderController.getLogin(
          req,
          res,
          sessionServiceMock,
          coreSessionServiceMock,
        ),
      ).rejects.toThrow(CoreMissingIdentityException);
    });

    it('should send an email notification to the end user by calling core.sendAuthenticationMail', async () => {
      // When
      await oidcProviderController.getLogin(
        req,
        res,
        sessionServiceMock,
        coreSessionServiceMock,
      );
      // Then
      expect(coreServiceMock.sendAuthenticationMail).toBeCalledTimes(1);
      expect(coreServiceMock.sendAuthenticationMail).toBeCalledWith(
        sessionDataMock,
        coreSessionServiceMock,
      );
    });

    it('should call handleSessionLife()', async () => {
      // When
      await oidcProviderController.getLogin(
        req,
        res,
        sessionServiceMock,
        coreSessionServiceMock,
      );
      // Then
      expect(oidcProviderController['handleSessionLife']).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderController['handleSessionLife']).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should call oidcProvider.interactionFinish', async () => {
      // When
      await oidcProviderController.getLogin(
        req,
        res,
        sessionServiceMock,
        coreSessionServiceMock,
      );
      // Then
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledWith(
        req,
        res,
        sessionDataMock,
      );
    });
  });

  describe('handleSessionLife', () => {
    beforeEach(() => {
      // Given
      oidcProviderController['shouldExtendSessionLifeTime'] = jest
        .fn()
        .mockReturnValueOnce(true);
    });

    it('should refresh session if shouldExtendSessionLifeTime() returns true', async () => {
      // When
      await oidcProviderController['handleSessionLife'](req, res);

      // Then
      expect(sessionServiceMock.refresh).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.refresh).toHaveBeenCalledWith(req, res);
    });

    it('should not refresh session if shouldExtendSessionLifeTime() returns false', async () => {
      // Given
      oidcProviderController['shouldExtendSessionLifeTime'] = jest
        .fn()
        .mockReturnValueOnce(false);

      // When
      await oidcProviderController['handleSessionLife'](req, res);

      // Then
      expect(sessionServiceMock.refresh).not.toHaveBeenCalled();
    });

    it('should detach session if sso is not enabled', async () => {
      // Given
      configServiceMock.get.mockReset().mockReturnValueOnce({
        enableSso: false,
      });

      // When
      await oidcProviderController['handleSessionLife'](req, res);

      // Then
      expect(sessionServiceMock.detach).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.detach).toHaveBeenCalledWith(res);
    });

    it('should not detach session if sso is enabled', async () => {
      // Given
      configServiceMock.get.mockReset().mockReturnValueOnce({
        enableSso: true,
      });

      // When
      await oidcProviderController['handleSessionLife'](req, res);

      // Then
      expect(sessionServiceMock.detach).not.toHaveBeenCalled();
    });
  });

  describe('shouldExtendSessionLifeTime', () => {
    const cases = [
      // expected, enableSso, slidingExpiration
      [true, true, false],
      [false, false, true],
      [false, true, true],
      [false, false, false],
    ];

    test.each(cases)(
      'should return %s for parameters, enableSso=%s, slidingExpiration=%s',
      (expected, enableSso, slidingExpiration) => {
        // Given
        configServiceMock.get
          .mockReset()
          .mockReturnValueOnce({
            enableSso,
          })
          .mockReturnValueOnce({
            slidingExpiration,
          });

        // When
        const result = oidcProviderController['shouldExtendSessionLifeTime']();

        // Then
        expect(result).toBe(expected);
      },
    );
  });
});
