import { Test, TestingModule } from '@nestjs/testing';

import { overrideWithSourceIfNotNull } from '@fc/common/helpers';
import { ConfigService } from '@fc/config';
import { OidcSession } from '@fc/oidc';
import { SessionService } from '@fc/session';
import { extractNetworkInfoFromHeaders } from '@fc/tracking-context';

import { getSessionServiceMock } from '@mocks/session';

import { ICoreTrackingContext } from '../interfaces';
import { CoreTrackingService } from './core-tracking.service';

jest.mock('@fc/common/helpers');
jest.mock('@fc/tracking-context', () => ({
  extractNetworkInfoFromHeaders: jest.fn(),
}));

describe('CoreTrackingService', () => {
  let service: CoreTrackingService;

  const sessionServiceMock = getSessionServiceMock();

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
  const sourcePortMock = '443';
  const xForwardedForOriginalMock = '123.123.123.123, 124.124.124.124';
  const interactionIdMock = 'interactionIdValue';
  const sessionIdMock = 'sessionIdValue';
  const browsingSessionIdMock = 'browsingSessionId Mock Value';

  const contextMock = {
    req: {
      headers: {
        'x-forwarded-for': ipMock,
        'x-forwarded-source-port': sourcePortMock,
        'x-forwarded-for-original': xForwardedForOriginalMock,
      },
      fc: {
        interactionId: interactionIdMock,
      },
    },
  };

  const extractedValueMock: ICoreTrackingContext = {
    source: {
      address: ipMock,
      port: sourcePortMock,
      // logs filter and analyses need this format
      // eslint-disable-next-line @typescript-eslint/naming-convention
      original_addresses: xForwardedForOriginalMock,
    },
    sessionId: sessionIdMock,
    interactionId: interactionIdMock,
    claims: ['foo', 'bar'],
    scope: 'fizz buzz',
    dpId: 'dp_uid',
    dpClientId: 'dp_client_id',
    dpTitle: 'dp_title',
    accountId: undefined,
    browsingSessionId: undefined,
    isSso: undefined,
    spId: undefined,
    spAcr: undefined,
    spName: undefined,
    idpId: undefined,
    idpAcr: undefined,
    idpName: undefined,
    idpLabel: undefined,
    idpIdentity: undefined,
  };

  const sessionDataMock: OidcSession = {
    accountId: 'accountId Mock Value',
    browsingSessionId: 'browsingSessionId Mock Value',
    sessionId: sessionIdMock,
    interactionId: interactionIdMock,

    subs: {
      clientId: 'sub client id',
      otherClientId: 'sub for other client id',
    },
    spId: 'clientId',
    spName: 'some spName',
    spAcr: 'some spAcr',
    spIdentity: {},

    idpId: 'some idpId',
    idpName: 'some idpName',
    idpLabel: 'some idpLabel',
    idpAcr: 'some idpAcr',
    idpIdentity: { sub: 'some idpSub' },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreTrackingService, SessionService, ConfigService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CoreTrackingService>(CoreTrackingService);

    sessionServiceMock.get.mockReturnValue(sessionDataMock);
    sessionServiceMock.getId.mockReturnValue(sessionIdMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildLog()', () => {
    const overrideWithSourceIfNotNullMock = jest.mocked(
      overrideWithSourceIfNotNull,
    );

    beforeEach(() => {
      service['extractContext'] = jest.fn().mockReturnValue(extractedValueMock);
      service['getDataFromSession'] = jest
        .fn()
        .mockReturnValue(sessionDataMock);
      overrideWithSourceIfNotNullMock.mockReturnValue({
        ...extractedValueMock,
        ...sessionDataMock,
      });
    });

    it('should call extractContext with req property of context param', async () => {
      // Given
      // When
      await service.buildLog(eventMock, contextMock);
      // Then
      expect(service['extractContext']).toHaveBeenCalledTimes(1);
      expect(service['extractContext']).toHaveBeenCalledWith(contextMock);
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
        source: {
          address: ipMock,
          port: sourcePortMock,
          // logs filter and analyses need this format
          // eslint-disable-next-line @typescript-eslint/naming-convention
          original_addresses: xForwardedForOriginalMock,
        },
        claims: 'foo bar',
        scope: 'fizz buzz',
        dpId: 'dp_uid',
        dpClientId: 'dp_client_id',
        dpTitle: 'dp_title',
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

    it('should return sessionId from context if provided', async () => {
      // Given
      const contextWithSessionIdMock = {
        sessionId: Symbol('contextWithSessionIdMock'),
      };
      // When
      const result = await service.buildLog(
        eventMock,
        contextWithSessionIdMock,
      );
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          sessionId: contextWithSessionIdMock.sessionId,
        }),
      );
    });

    it('should return object without claims if none provided', async () => {
      // Given
      const contextMock = {
        req: {},
      };
      const extractedContextMockValue = { ...extractedValueMock };
      extractedContextMockValue.claims = undefined;
      service['extractContext'] = jest
        .fn()
        .mockReturnValueOnce(extractedContextMockValue);
      // When
      const result = await service.buildLog(eventMock, contextMock);
      // Then
      expect(result).toEqual(
        expect.not.objectContaining({ claims: 'foo bar' }),
      );
    });
  });

  describe('extractContext()', () => {
    let extractNetworkInfoFromHeadersMock;

    beforeEach(() => {
      extractNetworkInfoFromHeadersMock = jest.mocked(
        extractNetworkInfoFromHeaders,
      );

      extractNetworkInfoFromHeadersMock.mockReturnValueOnce({
        address: ipMock,
        port: sourcePortMock,
        // logs filter and analyses need this format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        original_addresses: xForwardedForOriginalMock,
      });
    });

    it('should return informations from context', () => {
      // Given
      const contextMock = {
        req: {
          cookies: {
            _interaction: interactionIdMock,
          },
        },
        claims: ['foo', 'bar'],
        scope: 'fizz buzz',
        dpId: 'dp_uid',
        dpClientId: 'dp_client_id',
        dpTitle: 'dp_title',
        interactionId: interactionIdMock,
        sessionId: sessionIdMock,
      };
      // When
      const result = service['extractContext'](contextMock);
      // Then
      expect(result).toEqual(extractedValueMock);
    });

    it('should return informations from context with null for data provider information', () => {
      // Given
      const extractedValueWithNoDpMock: ICoreTrackingContext = {
        source: {
          address: ipMock,
          port: sourcePortMock,
          // logs filter and analyses need this format
          // eslint-disable-next-line @typescript-eslint/naming-convention
          original_addresses: xForwardedForOriginalMock,
        },
        sessionId: sessionIdMock,
        interactionId: interactionIdMock,
        claims: ['foo', 'bar'],
        scope: 'fizz buzz',
        dpId: undefined,
        dpClientId: undefined,
        dpTitle: undefined,
      };

      const contextMock = {
        req: {
          cookies: {
            _interaction: interactionIdMock,
          },
        },
        sessionId: sessionIdMock,
        claims: ['foo', 'bar'],
        scope: 'fizz buzz',
        interactionId: interactionIdMock,
      };
      // When
      const result = service['extractContext'](contextMock);
      // Then
      expect(result).toEqual(extractedValueWithNoDpMock);
    });
  });

  describe('getDataFromSession()', () => {
    it('should call session.get', () => {
      // When
      service['getDataFromSession'](sessionIdMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('OidcClient');
    });

    it('should return a default object with only sessionId, if session is not found', () => {
      // Given
      const expectedResult = {
        accountId: null,
        browsingSessionId: null,
        interactionId: null,
        sessionId: sessionIdMock,
        isSso: null,

        spId: null,
        spAcr: null,
        spName: null,
        spSub: null,

        idpId: null,
        idpAcr: null,
        idpName: null,
        idpLabel: null,
        idpSub: null,
      };
      sessionServiceMock.get.mockReturnValueOnce(null);

      // When
      const result = service['getDataFromSession'](sessionIdMock);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('Should return partial data from session.get', () => {
      // Given
      const expectedResult = {
        accountId: 'accountId Mock Value',
        browsingSessionId: 'browsingSessionId Mock Value',
        sessionId: sessionIdMock,
        interactionId: interactionIdMock,
        isSso: null,

        spId: 'clientId',
        spName: 'some spName',
        spAcr: 'some spAcr',
        spSub: 'sub client id',

        idpId: 'some idpId',
        idpName: 'some idpName',
        idpAcr: 'some idpAcr',
        idpSub: 'some idpSub',
        idpLabel: 'some idpLabel',
      };
      // When
      const result = service['getDataFromSession'](sessionIdMock);
      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should return null values for idp info and spSub if not set in session', () => {
      // Given
      const expectedResult = {
        accountId: null,
        browsingSessionId: browsingSessionIdMock,
        sessionId: sessionIdMock,
        interactionId: null,
        isSso: null,

        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        spSub: 'sub for spIdMock',

        idpId: null,
        idpName: null,
        idpAcr: null,
        idpSub: null,
        idpLabel: null,
      };
      const sessionMock: OidcSession = {
        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        subs: { spIdMock: 'sub for spIdMock' },
        browsingSessionId: browsingSessionIdMock,
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionMock);

      // When
      const result = service['getDataFromSession'](sessionIdMock);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should return null values for `idp` info if not set in session', () => {
      // Given
      const expectedResult = {
        accountId: null,
        sessionId: sessionIdMock,
        browsingSessionId: browsingSessionIdMock,
        interactionId: null,
        isSso: null,

        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        spSub: 'sub for spIdMock',

        idpId: null,
        idpName: null,
        idpAcr: null,
        idpSub: null,
        idpLabel: null,
      };
      const sessionMock: OidcSession = {
        spId: 'spIdMock',
        spName: 'spNameMock',
        spAcr: 'spAcrMock',
        subs: { spIdMock: 'sub for spIdMock' },
        spIdentity: {},
        browsingSessionId: browsingSessionIdMock,
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionMock);

      // When
      const result = service['getDataFromSession'](sessionIdMock);

      // Then
      expect(result).toEqual(expectedResult);
    });

    it('should return null values for `sp` info if not set in session', () => {
      // Given
      const expectedResult = {
        accountId: null,
        sessionId: sessionIdMock,
        browsingSessionId: browsingSessionIdMock,
        interactionId: null,
        isSso: null,

        spId: null,
        spName: null,
        spAcr: null,
        spSub: null,

        idpId: null,
        idpName: null,
        idpAcr: null,
        idpSub: null,
        idpLabel: null,
      };
      const sessionMock: OidcSession = {
        subs: {},
        spIdentity: {},
        browsingSessionId: browsingSessionIdMock,
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionMock);

      // When
      const result = service['getDataFromSession'](sessionIdMock);

      // Then
      expect(result).toEqual(expectedResult);
    });
  });
});
