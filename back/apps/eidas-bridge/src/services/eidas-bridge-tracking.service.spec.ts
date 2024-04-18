import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from '@fc/session';
import { TrackedEventContextInterface } from '@fc/tracking';
import {
  extractNetworkInfoFromHeaders,
  NetworkContextInterface,
} from '@fc/tracking-context';

import { getSessionServiceMock } from '@mocks/session';

import { EventsCategoriesEnum } from '../enums';
import { EidasBridgeTrackedEventInterface } from '../interfaces';
import { EidasBridgeTrackingService } from './eidas-bridge-tracking.service';

jest.mock('@fc/tracking-context');

describe('EidasBridgeTrackingService', () => {
  let service: EidasBridgeTrackingService;

  const trackedEventMock: EidasBridgeTrackedEventInterface = {
    event: 'eventMockedValue',
    category: 'categoryMockedValue',
    step: 'stepMockedValue',
    countryCodeSrc: 'countryCodeSrcMockedValue',
    countryCodeDst: 'countryCodeDstMockedValue',
  };

  const extractedContextMock = {
    foo: 'fooValue',
  };

  const sessionIdMock = 'sessionIdMockValue';

  const eventContextMock: TrackedEventContextInterface = {
    req: { sessionId: sessionIdMock },
  };

  const sessionServiceMock = getSessionServiceMock();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EidasBridgeTrackingService, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<EidasBridgeTrackingService>(
      EidasBridgeTrackingService,
    );

    sessionServiceMock.getId.mockReturnValue(sessionIdMock);
  });

  describe('buildLog', () => {
    beforeEach(() => {
      service['extractContext'] = jest
        .fn()
        .mockReturnValueOnce(extractedContextMock);
    });

    it('should call extractContext()', async () => {
      // When
      await service.buildLog(trackedEventMock, eventContextMock);
      // Then
      expect(service['extractContext']).toHaveBeenCalledTimes(1);
    });

    it('should return an object with keys from event and extractedContext', async () => {
      // When
      const result = await service.buildLog(trackedEventMock, eventContextMock);
      // Then
      expect(result).toEqual({
        ...trackedEventMock,
        ...extractedContextMock,
      });
    });
  });

  describe('extractContext', () => {
    const extractNetworkInfoFromHeadersMock = jest.mocked(
      extractNetworkInfoFromHeaders,
    );
    const networkInfoMock: NetworkContextInterface = {
      address: 'networkInfoMockValue',
      port: 'portValue',
    };

    beforeEach(() => {
      service['extractContextFromFrRequest'] = jest.fn();
      service['extractContextFromEuRequest'] = jest.fn();
      extractNetworkInfoFromHeadersMock.mockReturnValueOnce(networkInfoMock);
    });

    it('should call extractNetworkInfoFromHeaders()', async () => {
      // Given
      const eventMock = {
        ...trackedEventMock,
        category: EventsCategoriesEnum.FR_REQUEST,
      };
      // When
      await service['extractContext'](eventMock, eventContextMock);
      // Then
      expect(extractNetworkInfoFromHeadersMock).toHaveBeenCalledTimes(1);
      expect(extractNetworkInfoFromHeadersMock).toHaveBeenCalledWith(
        eventContextMock,
      );
    });

    it('should call extractContextFromFrRequest()', async () => {
      // Given
      const eventMock = {
        ...trackedEventMock,
        category: EventsCategoriesEnum.FR_REQUEST,
      };
      // When
      await service['extractContext'](eventMock, eventContextMock);
      // Then
      expect(service['extractContextFromFrRequest']).toHaveBeenCalledTimes(1);
    });

    it('should call extractContextFromEuRequest()', async () => {
      // Given
      const eventMock = {
        ...trackedEventMock,
        category: EventsCategoriesEnum.EU_REQUEST,
      };
      // When
      await service['extractContext'](eventMock, eventContextMock);
      // Then
      expect(service['extractContextFromEuRequest']).toHaveBeenCalledTimes(1);
    });

    it('should return extracted context', async () => {
      // Given
      const eventMock = {
        ...trackedEventMock,
        category: EventsCategoriesEnum.EU_REQUEST,
      };
      const euContextMock = { EuRequestKey: 'EuRequestValue' };
      service['extractContextFromEuRequest'] = jest
        .fn()
        .mockReturnValueOnce(euContextMock);
      // When
      const result = await service['extractContext'](
        eventMock,
        eventContextMock,
      );
      // Then
      expect(result).toEqual({
        source: networkInfoMock,
        sessionId: sessionIdMock,
        ...euContextMock,
      });
    });
  });

  describe('extractContextFromEuRequest', () => {
    it('should retrieve OidcClient session', () => {
      // When
      service['extractContextFromEuRequest']();
      // Then
      expect(sessionServiceMock.get).toHaveBeenNthCalledWith(1, 'OidcClient');
    });

    it('should retrieve EidasProvider session', () => {
      // When
      service['extractContextFromEuRequest']();
      // Then
      expect(sessionServiceMock.get).toHaveBeenNthCalledWith(
        2,
        'EidasProvider',
      );
    });

    it('should return an object containing properties extracted from session', () => {
      // Given
      const oidcClientSessionMock = { idpIdentity: { sub: 'subMockValue' } };
      const eidasProviderSessionMock = {
        eidasRequest: {
          levelOfAssurance: 'levelOfAssuranceValue (request)',
          spCountryCode: 'spCountryCodeValue',
        },
        partialEidasResponse: {
          levelOfAssurance: 'levelOfAssuranceValue (response)',
          subject: 'subjectValue',
        },
      };
      sessionServiceMock.get
        .mockReturnValueOnce(oidcClientSessionMock)
        .mockReturnValueOnce(eidasProviderSessionMock);

      // When
      const result = service['extractContextFromEuRequest']();
      // Then
      expect(result).toEqual({
        eidasLevelRequested:
          eidasProviderSessionMock.eidasRequest.levelOfAssurance,
        countryCodeSrc: eidasProviderSessionMock.eidasRequest.spCountryCode,
        eidasLevelReceived:
          eidasProviderSessionMock.partialEidasResponse.levelOfAssurance,
        idpSub: oidcClientSessionMock.idpIdentity.sub,
        spSub: eidasProviderSessionMock.partialEidasResponse.subject,
      });
    });

    it('should return undefined values for properties that are not available', () => {
      // When
      const result = service['extractContextFromEuRequest']();
      // Then
      expect(result).toEqual({
        eidasLevelRequested: undefined,
        countryCodeSrc: undefined,
        eidasLevelReceived: undefined,
        idpSub: undefined,
        spSub: undefined,
      });
    });
  });

  describe('extractContextFromFrRequest', () => {
    it('should retrieve OidcClient session', () => {
      // When
      service['extractContextFromFrRequest'](eventContextMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenNthCalledWith(1, 'OidcClient');
    });

    it('should retrieve EidasClient session', () => {
      // When
      service['extractContextFromFrRequest'](eventContextMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenNthCalledWith(2, 'EidasClient');
    });

    it('should return an object containing properties extracted from session', () => {
      // Given
      const oidcClientSessionMock = {
        idpIdentity: { sub: 'subMockValue (idp)' },
        subs: { spIdMock: 'subMockValue (sp)' },
        spId: 'spIdMock',
      };
      const eidasClientSessionMock = {
        eidasRequest: {
          citizenCountryCode: 'citizenCountryCodeValue',
        },
        eidasPartialRequest: {
          levelOfAssurance: 'levelOfAssuranceValue (request)',
        },
        eidasResponse: {
          levelOfAssurance: 'levelOfAssuranceValue (response)',
        },
      };
      sessionServiceMock.get
        .mockReturnValueOnce(oidcClientSessionMock)
        .mockReturnValueOnce(eidasClientSessionMock);

      // When
      const result = service['extractContextFromFrRequest'](eventContextMock);
      // Then
      expect(result).toEqual({
        eidasLevelRequested:
          eidasClientSessionMock.eidasPartialRequest.levelOfAssurance,
        countryCodeDst: eidasClientSessionMock.eidasRequest.citizenCountryCode,
        eidasLevelReceived:
          eidasClientSessionMock.eidasResponse.levelOfAssurance,
        idpSub: oidcClientSessionMock.idpIdentity.sub,
        spSub: 'subMockValue (sp)',
      });
    });

    it('should return undefined values for properties that are not available', () => {
      // When
      const result = service['extractContextFromFrRequest'](eventContextMock);
      // Then
      expect(result).toEqual({
        eidasLevelRequested: undefined,
        countryCodeDst: undefined,
        eidasLevelReceived: undefined,
        idpSub: undefined,
        spSub: undefined,
      });
    });

    it('should return countryCodeDst from context if available', () => {
      // Given
      const countryCodeDstMock = 'countryCodeDstFromContext';
      const contextMock = {
        ...eventContextMock,
        countryCodeDst: countryCodeDstMock,
      };
      // When
      const result = service['extractContextFromFrRequest'](contextMock);
      // Then
      expect(result).toEqual({
        eidasLevelRequested: undefined,
        countryCodeDst: countryCodeDstMock,
        eidasLevelReceived: undefined,
        idpSub: undefined,
        spSub: undefined,
      });
    });
  });
});
