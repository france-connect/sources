import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { SessionService } from '@fc/session';

import { UserDashboardMissingContextException } from '../exceptions';
import { UserDashboardTrackingContextInterface } from '../interfaces';
import { UserDashboardTrackingService } from './user-dashboard-tracking.service';

jest.mock('uuid');

describe('UserDashboardTrackingService', () => {
  let service: UserDashboardTrackingService;

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
    category: 'some category',
    event: 'name',
    route: '/',
    exceptions: [],
    intercept: false,
  };

  const ipMock = '123.123.123.123';
  const sourcePortMock = '443';
  const xForwardedForOriginalMock = '123.123.123.123, 124.124.124.124';
  const sessionIdMock = 'sessionIdValue';

  const identityMock = {
    sub: 'identityMock.sub value',
  };

  const contextMock = {
    req: {
      headers: {
        'x-forwarded-for': ipMock,
        'x-forwarded-source-port': sourcePortMock,
        'x-forwarded-for-original': xForwardedForOriginalMock,
      },
      sessionId: sessionIdMock,
    },
    identity: identityMock,
    idpChanges: {
      uid: 'uuidValue',
      name: 'nameValue',
      title: 'titleValue',
      allowed: 'allowedValue',
    },
    futureAllowedNewValue: true,
    hasAllowFutureIdpChanged: true,
    idpLength: 2,
    changeSetId: 'changeSetIdValue',
  };

  const extractedValueMock: UserDashboardTrackingContextInterface = {
    ip: ipMock,
    port: sourcePortMock,
    originalAddresses: xForwardedForOriginalMock,
    sessionId: sessionIdMock,
  };

  const extractedContextMock = {
    idpSettingsChanges: Symbol('idpSettingsChanges'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDashboardTrackingService, SessionService, ConfigService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<UserDashboardTrackingService>(
      UserDashboardTrackingService,
    );
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildLog()', () => {
    beforeEach(() => {
      service['extractContext'] = jest
        .fn()
        .mockReturnValueOnce(extractedValueMock);
      service['getDataFromContext'] = jest
        .fn()
        .mockReturnValue(extractedContextMock);
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
        payload: {
          futureAllowedNewValue: true,
          hasAllowFutureIdpChanged: true,
          idpLength: 2,
          uid: 'uuidValue',
          name: 'nameValue',
          title: 'titleValue',
          allowed: 'allowedValue',
        },
        changeSetId: 'changeSetIdValue',
        sessionId: 'sessionIdValue',
        sub: identityMock.sub,
      };
      // When
      const result = await service.buildLog(eventMock, contextMock);
      // Then
      expect(result).toEqual(expectedResult);
    });
  });

  describe('extractContext()', () => {
    let extractNetworkInfoFromHeadersMock;

    beforeEach(() => {
      extractNetworkInfoFromHeadersMock = jest.spyOn<
        UserDashboardTrackingService,
        any
      >(service, 'extractNetworkInfoFromHeaders');
      extractNetworkInfoFromHeadersMock.mockReturnValueOnce({
        ip: ipMock,
        port: sourcePortMock,
        originalAddresses: xForwardedForOriginalMock,
      });
    });

    it('should return informations from context', () => {
      // Given
      const contextMock = {
        req: {
          sessionId: sessionIdMock,
        },
      };
      // When
      const result = service['extractContext'](contextMock);
      // Then
      expect(result).toEqual(extractedValueMock);
    });

    it('should throw if req is missing', () => {
      // Given
      const contextMock = {};

      // Then
      expect(() => service['extractContext'](contextMock)).toThrow(
        UserDashboardMissingContextException,
      );
    });
  });

  describe('extractNetworkInfoFromHeaders', () => {
    let checkForMissingHeadersMock;

    beforeEach(() => {
      checkForMissingHeadersMock = jest.spyOn<
        UserDashboardTrackingService,
        any
      >(service, 'checkForMissingHeaders');
    });

    it('should throw if header is missing', () => {
      // Given
      const contextMock = { req: { fc: { interactionId: 'foo' } } };
      // Then
      expect(() =>
        service['extractNetworkInfoFromHeaders'](contextMock),
      ).toThrow(UserDashboardMissingContextException);
    });

    it('should call checkForMissingHeaders', () => {
      // Given
      const contextMock = {
        req: {
          headers: {
            'x-forwarded-for': ipMock,
            'x-forwarded-source-port': sourcePortMock,
            'x-forwarded-for-original': xForwardedForOriginalMock,
          },
          fc: { interactionId: 'foo' },
        },
      };
      // When
      service['extractNetworkInfoFromHeaders'](contextMock);
      // Then
      expect(checkForMissingHeadersMock).toHaveBeenCalledTimes(1);
      expect(checkForMissingHeadersMock).toHaveBeenCalledWith(
        ipMock,
        sourcePortMock,
        xForwardedForOriginalMock,
      );
    });

    it('should retrieve network information from the provided context.', () => {
      // Given
      const contextMock = {
        req: {
          headers: {
            'x-forwarded-for': ipMock,
            'x-forwarded-source-port': sourcePortMock,
            'x-forwarded-for-original': xForwardedForOriginalMock,
          },
          fc: { interactionId: 'foo' },
        },
      };
      // When
      const result = service['extractNetworkInfoFromHeaders'](contextMock);
      // Then
      expect(result).toEqual({
        ip: ipMock,
        port: sourcePortMock,
        originalAddresses: xForwardedForOriginalMock,
      });
    });
  });

  describe('checkForMissingHeaders', () => {
    it('should throw if ip is missing', () => {
      expect(() =>
        service['checkForMissingHeaders'](
          undefined,
          sourcePortMock,
          xForwardedForOriginalMock,
        ),
      ).toThrow(UserDashboardMissingContextException);
    });

    it('should throw if source port is missing', () => {
      expect(() =>
        service['checkForMissingHeaders'](
          ipMock,
          undefined,
          xForwardedForOriginalMock,
        ),
      ).toThrow(UserDashboardMissingContextException);
    });

    it('should throw if xForwardedForOriginal is missing', () => {
      expect(() =>
        service['checkForMissingHeaders'](ipMock, sourcePortMock, undefined),
      ).toThrow(UserDashboardMissingContextException);
    });
  });
});
