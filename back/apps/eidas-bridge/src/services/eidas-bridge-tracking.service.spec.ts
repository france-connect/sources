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

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EidasBridgeTrackingService],
    }).compile();

    service = module.get<EidasBridgeTrackingService>(
      EidasBridgeTrackingService,
    );
  });

  describe('buildLog', () => {
    beforeEach(() => {
      service['extractContext'] = jest
        .fn()
        .mockResolvedValueOnce(extractedContextMock);
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
      expect(service['extractContextFromFrRequest']).toHaveBeenCalledWith(
        eventContextMock,
      );
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
      expect(service['extractContextFromEuRequest']).toHaveBeenCalledWith(
        eventContextMock,
      );
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
        .mockResolvedValueOnce(euContextMock);
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
    const getBoundSessionMock = getSessionServiceMock();

    beforeEach(() => {
      jest
        .spyOn(SessionService, 'getBoundSession')
        .mockReturnValue(getBoundSessionMock);
    });

    it('should call SessionService.getBoundSession', async () => {
      // When
      await service['extractContextFromEuRequest'](eventContextMock);
      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledTimes(2);
    });

    it('should retrieve OidcClient session', async () => {
      // When
      await service['extractContextFromEuRequest'](eventContextMock);
      // Then
      expect(SessionService.getBoundSession).toHaveBeenNthCalledWith(
        1,
        eventContextMock.req,
        'OidcClient',
      );
    });

    it('should retrieve EidasProvider session', async () => {
      // When
      await service['extractContextFromEuRequest'](eventContextMock);
      // Then
      expect(SessionService.getBoundSession).toHaveBeenNthCalledWith(
        2,
        eventContextMock.req,
        'EidasProvider',
      );
    });

    it('should return an object containing properties extracted from session', async () => {
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
      getBoundSessionMock.get
        .mockResolvedValueOnce(oidcClientSessionMock)
        .mockResolvedValueOnce(eidasProviderSessionMock);
      // When
      const result = await service['extractContextFromEuRequest'](
        eventContextMock,
      );
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

    it('should return undefined values for properties that are not available', async () => {
      // When
      const result = await service['extractContextFromEuRequest'](
        eventContextMock,
      );
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
    const getBoundSessionMock = getSessionServiceMock();

    beforeEach(() => {
      jest
        .spyOn(SessionService, 'getBoundSession')
        .mockReturnValue(getBoundSessionMock);
    });

    it('should call SessionService.getBoundSession', async () => {
      // When
      await service['extractContextFromFrRequest'](eventContextMock);
      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledTimes(2);
    });

    it('should retrieve OidcClient session', async () => {
      // When
      await service['extractContextFromFrRequest'](eventContextMock);
      // Then
      expect(SessionService.getBoundSession).toHaveBeenNthCalledWith(
        1,
        eventContextMock.req,
        'OidcClient',
      );
    });

    it('should retrieve EidasClient session', async () => {
      // When
      await service['extractContextFromFrRequest'](eventContextMock);
      // Then
      expect(SessionService.getBoundSession).toHaveBeenNthCalledWith(
        2,
        eventContextMock.req,
        'EidasClient',
      );
    });

    it('should return an object containing properties extracted from session', async () => {
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
      getBoundSessionMock.get
        .mockResolvedValueOnce(oidcClientSessionMock)
        .mockResolvedValueOnce(eidasClientSessionMock);

      // When
      const result = await service['extractContextFromFrRequest'](
        eventContextMock,
      );
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

    it('should return undefined values for properties that are not available', async () => {
      // When
      const result = await service['extractContextFromFrRequest'](
        eventContextMock,
      );
      // Then
      expect(result).toEqual({
        eidasLevelRequested: undefined,
        countryCodeDst: undefined,
        eidasLevelReceived: undefined,
        idpSub: undefined,
        spSub: undefined,
      });
    });

    it('should return countryCodeDst from context if available', async () => {
      // Given
      const countryCodeDstMock = 'countryCodeDstFromContext';
      const contextMock = {
        ...eventContextMock,
        countryCodeDst: countryCodeDstMock,
      };
      // When
      const result = await service['extractContextFromFrRequest'](contextMock);
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
