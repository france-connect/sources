import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { OidcSession } from '@fc/oidc';
import {
  ISessionBoundContext,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';
import { IEventContext } from '@fc/tracking';

import { CoreMissingContextException } from '../exceptions';
import { ICoreTrackingContext } from '../interfaces';
import { CoreTrackingService } from './core-tracking.service';

describe('CoreTrackingService', () => {
  let service: CoreTrackingService;

  const sessionServiceMock = {
    get: {
      bind: jest.fn(),
    },
    getAlias: jest.fn(),
  };

  const appConfigMock = {
    urlPrefix: '/api/v2',
  };

  const configServiceMock = {
    get: () => appConfigMock,
  };

  const eventMock = {
    step: '1',
    category: 'some category',
    event: 'name',
    route: '/',
    exceptions: [],
    intercept: false,
  };

  const ipMock = '123.123.123.123';
  const interactionIdMock = 'interactionIdValue';
  const sessionIdMock = 'sessionIdValue';

  const contextMock = {
    req: {
      headers: { 'x-forwarded-for': ipMock },
      fc: {
        interactionId: interactionIdMock,
      },
    },
  };

  const extractedValueMock: ICoreTrackingContext = {
    ip: ipMock,
    sessionId: sessionIdMock,
    interactionId: interactionIdMock,
    claims: ['foo', 'bar'],
  };

  const sessionDataMock: OidcSession = {
    accountId: 'accountId Mock Value',

    spId: 'some spId',
    spName: 'some spName',
    spAcr: 'some spAcr',
    spIdentity: { sub: 'some spSub' },

    idpId: 'some idpId',
    idpName: 'some idpName',
    idpAcr: 'some idpAcr',
    idpIdentity: { sub: 'some idpSub' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreTrackingService, SessionService, ConfigService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CoreTrackingService>(CoreTrackingService);
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const sessionGetBinded = jest.fn().mockResolvedValue(sessionDataMock);
    sessionServiceMock.get.bind.mockReturnValue(sessionGetBinded);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildLog()', () => {
    let extractContextMock;
    let getDataFromContextMock;
    let getDataFromSessionMock;

    beforeEach(() => {
      extractContextMock = jest.spyOn<CoreTrackingService, any>(
        service,
        'extractContext',
      );

      getDataFromContextMock = jest.spyOn<CoreTrackingService, any>(
        service,
        'getDataFromContext',
      );

      getDataFromSessionMock = jest.spyOn<CoreTrackingService, any>(
        service,
        'getDataFromSession',
      );

      extractContextMock.mockResolvedValueOnce(extractedValueMock);
      getDataFromContextMock.mockReturnValueOnce();
      getDataFromSessionMock.mockResolvedValueOnce(sessionDataMock);
    });

    it('should call extractContext with req property of context param', async () => {
      // Given
      // When
      await service.buildLog(eventMock, contextMock);
      // Then
      expect(service['extractContext']).toHaveBeenCalledTimes(1);
      expect(service['extractContext']).toHaveBeenCalledWith(contextMock);
    });

    it('should call service.getDataFromContext if event is FC_AUTHORIZE_INITIATED', async () => {
      // Given
      // When
      await service.buildLog(
        service.EventsMap.FC_AUTHORIZE_INITIATED,
        contextMock,
      );
      // Then
      expect(service['getDataFromContext']).toHaveBeenCalledTimes(1);
      expect(service['getDataFromContext']).toHaveBeenCalledWith(contextMock);
      expect(service['getDataFromSession']).toHaveBeenCalledTimes(0);
    });

    it('should call service.getDataFromContext if event is not FC_AUTHORIZE_INITIATED', async () => {
      // Given
      // When
      await service.buildLog(
        service.EventsMap.FC_SHOWED_IDP_CHOICE,
        contextMock,
      );
      // Then
      expect(service['getDataFromContext']).toHaveBeenCalledTimes(0);
      expect(service['getDataFromSession']).toHaveBeenCalledTimes(1);
      expect(service['getDataFromSession']).toHaveBeenCalledWith(sessionIdMock);
    });

    it('should return log message', async () => {
      // Given
      const expectedResult = {
        ...sessionDataMock,
        interactionId: interactionIdMock,
        step: eventMock.step,
        category: eventMock.category,
        event: eventMock.event,
        ip: ipMock,
        claims: 'foo bar',
      };
      // When
      const result = await service.buildLog(eventMock, contextMock);
      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should return object containing joined claims', async () => {
      // Given
      const contextMock = {
        req: {},
        claims: ['foo', 'bar'],
      };
      // When
      const result = await service.buildLog(eventMock, contextMock);
      // Then
      expect(result).toEqual(expect.objectContaining({ claims: 'foo bar' }));
    });

    it('should return object without claims if none provided', async () => {
      // Given
      const contextMock = {
        req: {},
      };
      const extractedContextMockValue = { ...extractedValueMock };
      extractedContextMockValue.claims = undefined;
      extractContextMock.mockReset();
      extractContextMock.mockResolvedValueOnce(extractedContextMockValue);
      // When
      const result = await service.buildLog(eventMock, contextMock);
      // Then
      expect(result).toEqual(
        expect.not.objectContaining({ claims: 'foo bar' }),
      );
    });
  });

  describe('extractContext()', () => {
    let extractIpFromContextMock;
    let getInteractionIdFromContextMock;

    beforeEach(() => {
      extractIpFromContextMock = jest.spyOn<CoreTrackingService, any>(
        service,
        'extractIpFromContext',
      );
      extractIpFromContextMock.mockReturnValueOnce(ipMock);

      getInteractionIdFromContextMock = jest.spyOn<CoreTrackingService, any>(
        service,
        'getInteractionIdFromContext',
      );

      getInteractionIdFromContextMock.mockReturnValueOnce(interactionIdMock);
    });

    it('should return informations from context', async () => {
      // Given
      const contextMock = {
        req: {
          cookies: {
            _interaction: interactionIdMock,
          },
          sessionId: sessionIdMock,
          claims: ['foo', 'bar'],
        },
      };
      // When
      const result = await service['extractContext'](contextMock);
      // Then
      expect(result).toEqual(extractedValueMock);
    });

    it('should throw if req is missing', async () => {
      // Given
      const contextMock = { foo: 'bar' };

      // Then
      await expect(() =>
        service['extractContext'](contextMock),
      ).rejects.toThrow(CoreMissingContextException);
    });

    it('should return informations from session', async () => {
      // Given
      sessionServiceMock.getAlias.mockResolvedValueOnce(sessionIdMock);
      const contextMock = {
        req: {
          headers: { 'x-forwarded-for': '123.123.123.123' },
          cookies: {
            _interaction: interactionIdMock,
          },
          claims: ['foo', 'bar'],
        },
        // sessionId is voluntary missing
      };
      // When
      const result = await service['extractContext'](contextMock);
      // Then
      expect(result).toEqual(extractedValueMock);
      expect(getInteractionIdFromContextMock).toHaveBeenCalledTimes(1);
      expect(getInteractionIdFromContextMock).toHaveBeenCalledWith(contextMock);
    });

    it('should throw if interactionId is missing', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      extractIpFromContextMock.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });

      const contextMock = { req: {} };
      // Then
      await expect(() =>
        service['extractContext'](contextMock),
      ).rejects.toThrow(errorMock);
    });

    it('should throw if `getInteractionIdFromContext` failed', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      getInteractionIdFromContextMock.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });

      const contextMock = {
        req: {
          cookies: {
            _interaction: interactionIdMock,
          },
          sessionId: sessionIdMock,
        },
      };
      // Then
      await expect(() =>
        service['extractContext'](contextMock),
      ).rejects.toThrow(errorMock);
    });
  });

  describe('extractIpFromContext()', () => {
    it('should retreive an IP from the provided context.', () => {
      // Given
      const contextMock = {
        req: {
          headers: {
            'x-forwarded-for': ipMock,
          },
          fc: { interactionId: 'foo' },
        },
      };
      // When
      const result = service['extractIpFromContext'](contextMock);
      // Then
      expect(result).toEqual(ipMock);
    });

    it('should throw if header is missing', () => {
      // Given
      const contextMock = { req: { fc: { interactionId: 'foo' } } };
      // Then
      expect(() => service['extractIpFromContext'](contextMock)).toThrow(
        CoreMissingContextException,
      );
    });

    it('should throw if ip is missing', () => {
      // Given
      const contextMock = {
        req: { headers: {}, fc: { interactionId: 'foo' } },
      };
      // Then
      expect(() => service['extractIpFromContext'](contextMock)).toThrow(
        CoreMissingContextException,
      );
    });
  });

  describe('extractInteractionId', () => {
    it('should retrieve an interactionId if provided in `req.fc.interactionId`', () => {
      // Given
      const eventContextMock: IEventContext = {
        fc: { interactionId: interactionIdMock },
      };

      // When
      const result: string = service['extractInteractionId'](eventContextMock);

      // Then
      expect(result).toBe(interactionIdMock);
    });

    it('should retrieve an interactionId if provided in `req.body.uid`', () => {
      // Given
      const eventContextMock: IEventContext = {
        body: { uid: interactionIdMock },
      };

      // When
      const result: string = service['extractInteractionId'](eventContextMock);

      // Then
      expect(result).toBe(interactionIdMock);
    });

    it('should retrieve an interactionId if provided in `req.params.uid`', () => {
      // Given
      const eventContextMock: IEventContext = {
        params: { uid: interactionIdMock },
      };

      // When
      const result: string = service['extractInteractionId'](eventContextMock);

      // Then
      expect(result).toBe(interactionIdMock);
    });

    it('should retrieve an interactionId if provided in `req.cookies._interaction`', () => {
      // Given
      const eventContextMock: IEventContext = {
        cookies: { _interaction: interactionIdMock },
      };

      // When
      const result: string = service['extractInteractionId'](eventContextMock);

      // Then
      expect(result).toBe(interactionIdMock);
    });

    it('should return [undefined] if interactionId is not found / context is corrupted', () => {
      // Given
      const eventContextMock: IEventContext = {};

      // When
      const result: string = service['extractInteractionId'](eventContextMock);

      // Then
      expect(result).toBe(undefined);
    });
  });

  describe('getInteractionIdFromContext()', () => {
    it('should throw an Exception `CoreMissingContextException` if the context is corrupt', () => {
      // Given
      const eventContextMock = {};
      service['extractInteractionId'] = jest
        .fn()
        .mockReturnValueOnce(undefined);

      // When
      expect(
        () => service['getInteractionIdFromContext'](eventContextMock),
        // Then
      ).toThrow(CoreMissingContextException);
    });

    it('should return interactionId provided by extractInteractionId if the context is ok', () => {
      // Given
      const eventContextMock = {};
      service['extractInteractionId'] = jest
        .fn()
        .mockReturnValueOnce(interactionIdMock);

      // When
      const result = service['getInteractionIdFromContext'](eventContextMock);
      expect(result).toBe(interactionIdMock);
    });
  });

  describe('getDataFromSession()', () => {
    it('should call session.get', async () => {
      // Given
      const boundSessionContextMock: ISessionBoundContext = {
        sessionId: sessionIdMock,
        moduleName: 'OidcClient',
      };
      const sessionGetBinded = jest.fn().mockResolvedValue(sessionDataMock);
      sessionServiceMock.get.bind.mockReturnValueOnce(sessionGetBinded);
      // When
      await service['getDataFromSession'](sessionIdMock);
      // Then
      expect(sessionServiceMock.get.bind).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get.bind).toHaveBeenCalledWith(
        sessionServiceMock,
        boundSessionContextMock,
      );
    });

    it('should throw if session is not found', async () => {
      // Given
      const sessionGetBinded = jest.fn().mockResolvedValue(undefined);
      sessionServiceMock.get.bind.mockReturnValueOnce(sessionGetBinded);
      // Then
      await expect(
        service['getDataFromSession'](sessionIdMock),
      ).rejects.toThrow(SessionNotFoundException);
    });

    it('Should return partial data from session.get', async () => {
      // Given
      const expectedResult = {
        accountId: 'accountId Mock Value',

        spId: 'some spId',
        spName: 'some spName',
        spAcr: 'some spAcr',
        spSub: 'some spSub',

        idpId: 'some idpId',
        idpName: 'some idpName',
        idpAcr: 'some idpAcr',
        idpSub: 'some idpSub',
      };
      // When
      const result = await service['getDataFromSession'](sessionIdMock);
      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should return null values for idp info and spSub if not set in session', async () => {
      // Given
      const expectedResult = {
        accountId: null,

        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        spSub: null,

        idpId: null,
        idpName: null,
        idpAcr: null,
        idpSub: null,
      };
      const sessionMock: OidcSession = {
        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
      };
      const sessionGetBinded = jest.fn().mockResolvedValue(sessionMock);
      sessionServiceMock.get.bind.mockReturnValueOnce(sessionGetBinded);
      // When
      const result = await service['getDataFromSession'](interactionIdMock);
      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should return null values for `idp` info if not set in session', async () => {
      // Given
      const expectedResult = {
        accountId: null,

        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        spSub: 'spSubMock',

        idpId: null,
        idpName: null,
        idpAcr: null,
        idpSub: null,
      };
      const sessionMock: OidcSession = {
        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        spIdentity: { sub: 'spSubMock' },
      };
      const sessionGetBinded = jest.fn().mockResolvedValue(sessionMock);
      sessionServiceMock.get.bind.mockReturnValueOnce(sessionGetBinded);

      // When
      const result = await service['getDataFromSession'](interactionIdMock);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should return null values for `sp` info if not set in session', async () => {
      // Given
      const expectedResult = {
        accountId: null,

        spId: null,
        spName: null,
        spAcr: null,
        spSub: 'spSubMock',

        idpId: null,
        idpName: null,
        idpAcr: null,
        idpSub: null,
      };
      const sessionMock: OidcSession = {
        spIdentity: { sub: 'spSubMock' },
      };
      const sessionGetBinded = jest.fn().mockResolvedValue(sessionMock);
      sessionServiceMock.get.bind.mockReturnValueOnce(sessionGetBinded);

      // When
      const result = await service['getDataFromSession'](interactionIdMock);

      // Then
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDataFromContext()', () => {
    it('Should return partial data from context and null values', () => {
      // Given
      const expectedResult = {
        accountId: null,

        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        spSub: 'spSubMock',

        idpId: null,
        idpName: null,
        idpAcr: null,
        idpSub: null,
      };

      const myContextMock = {
        ...contextMock,
        req: {
          spId: 'spIdMock',
          spName: 'spNameMock',
          spAcr: 'spAcrMock',
          spSub: 'spSubMock',
        },
      };
      // When
      const result = service['getDataFromContext'](myContextMock);
      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should throw if req is missing', () => {
      // Given
      const contextMock = {};
      // Then
      expect(() => service['getDataFromContext'](contextMock)).toThrow(
        CoreMissingContextException,
      );
    });
  });
});
