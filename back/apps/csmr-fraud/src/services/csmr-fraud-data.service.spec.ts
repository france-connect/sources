import { Test, TestingModule } from '@nestjs/testing';

import { CsmrAccountClientService } from '@fc/csmr-account-client';
import { FraudTrackDto, TrackingDataDto } from '@fc/csmr-fraud-client';
import { LoggerService } from '@fc/logger';
import { TracksAdapterElasticsearchService } from '@fc/tracks-adapter-elasticsearch';

import { getLoggerMock } from '@mocks/logger';

import {
  SecurityTicketDataInterface,
  TracksFormatterOutputInterface,
} from '../interfaces';
import { getSecurityTicketData, getTrackingData } from '../utils';
import { CsmrFraudDataService } from './csmr-fraud-data.service';

jest.mock('../utils');

describe('CsmrFraudDataService', () => {
  let service: CsmrFraudDataService;

  const accountServiceMock = {
    getAccountIdsFromIdentity: jest.fn(),
  };

  const tracksServiceMock = {
    getTracksForAuthenticationEventId: jest.fn(),
  };
  const loggerMock = getLoggerMock();

  const identityMock = {
    given_name: 'firstName',
    family_name: 'lastName',
    birthdate: 'birthdate',
    gender: 'gender',
    birthplace: 'birthplace',
    birthcountry: 'birthcountry',
  };

  const authenticationEventIdMock = Symbol(
    'authenticationEventIdMock',
  ) as unknown as string;

  const fraudCaseMock = {
    id: 'fraudCaseIdMock',
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@fi.fr',
    authenticationEventId: authenticationEventIdMock,
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
  };

  const accountIdLowMock = 'accountIdLowMock';
  const accountIdHighMock = 'accountIdHighMock';

  const accountIdsMock = {
    accountIdLow: accountIdLowMock,
    accountIdHigh: accountIdHighMock,
  };
  const groupIdsMock = [accountIdLowMock, accountIdHighMock];

  const tracksMock = {
    payload: Symbol('payload') as unknown as TracksFormatterOutputInterface,
  };

  const fraudTrackMock = Symbol(
    'fraudConnexionMock',
  ) as unknown as FraudTrackDto;

  const ticketDataMock = Symbol(
    'ticketDataMock',
  ) as unknown as SecurityTicketDataInterface;

  const trackingDataMock = Symbol(
    'trackingDataMock',
  ) as unknown as TrackingDataDto;

  const errorMock = new Error();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrFraudDataService,
        CsmrAccountClientService,
        TracksAdapterElasticsearchService,
        LoggerService,
      ],
    })
      .overrideProvider(CsmrAccountClientService)
      .useValue(accountServiceMock)
      .overrideProvider(TracksAdapterElasticsearchService)
      .useValue(tracksServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<CsmrFraudDataService>(CsmrFraudDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enrichFraudData', () => {
    beforeEach(() => {
      accountServiceMock.getAccountIdsFromIdentity.mockResolvedValue(
        accountIdsMock,
      );
      service['buildSecurityTicketContext'] = jest.fn();
    });

    it('should call accountMock.getAccountIdsFromIdentity() with identity', async () => {
      // When
      await service.enrichFraudData(identityMock, fraudCaseMock);

      // Then
      expect(
        accountServiceMock.getAccountIdsFromIdentity,
      ).toHaveBeenCalledTimes(1);
      expect(accountServiceMock.getAccountIdsFromIdentity).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('should call logger.err with errorMock if getAccountIdsFromIdentity failed', async () => {
      // Given
      accountServiceMock.getAccountIdsFromIdentity.mockImplementationOnce(
        () => {
          throw errorMock;
        },
      );

      // When
      await service.enrichFraudData(identityMock, fraudCaseMock);

      // Then
      expect(loggerMock.err).toHaveBeenCalledOnce();
      expect(loggerMock.err).toHaveBeenCalledWith(errorMock);
    });

    it('should call buildSecurityTicketContext with identity, fraudCase, accountIds and groupIds', async () => {
      // When
      await service.enrichFraudData(identityMock, fraudCaseMock);

      // Then
      expect(
        service['buildSecurityTicketContext'],
      ).toHaveBeenCalledExactlyOnceWith(
        identityMock,
        fraudCaseMock,
        accountIdsMock,
        groupIdsMock,
      );
    });
  });

  describe('enrichUnverifiedIdentityFraudData', () => {
    it('should call buildSecurityTicketContext with identity, fraudCase, empty accountIds and groupIds', async () => {
      // Given
      service['buildSecurityTicketContext'] = jest.fn();

      // When
      await service.enrichUnverifiedIdentityFraudData(
        identityMock,
        fraudCaseMock,
      );

      // Then
      expect(
        service['buildSecurityTicketContext'],
      ).toHaveBeenCalledExactlyOnceWith(identityMock, fraudCaseMock, {}, []);
    });
  });

  describe('buildSecurityTicketContext', () => {
    beforeEach(() => {
      jest.mocked(getSecurityTicketData).mockReturnValue(ticketDataMock);
      jest.mocked(getTrackingData).mockReturnValue(trackingDataMock);
      service['fetchFraudTracks'] = jest.fn().mockReturnValue([fraudTrackMock]);
    });

    it('should call fetchFraudTracks with authenticationEventId', async () => {
      // When
      await service['buildSecurityTicketContext'](
        identityMock,
        fraudCaseMock,
        accountIdsMock,
        groupIdsMock,
      );

      // Then
      expect(service['fetchFraudTracks']).toHaveBeenCalledExactlyOnceWith(
        authenticationEventIdMock,
      );
    });

    it('should not call fetchFraudTracks', async () => {
      // Given
      const fraudCaseWithFraudTracksMock = {
        id: 'fraudCaseIdMock',
        contactEmail: 'email@mock.fr',
        idpEmail: 'email@fi.fr',
        authenticationEventId: authenticationEventIdMock,
        fraudSurveyOrigin: 'fraudSurveyOriginMock',
        comment: 'commentMock',
        phoneNumber: '0678912345',
        fraudTracks: [fraudTrackMock],
      };

      // When
      await service['buildSecurityTicketContext'](
        identityMock,
        fraudCaseWithFraudTracksMock,
        accountIdsMock,
        groupIdsMock,
      );

      // Then
      expect(service['fetchFraudTracks']).not.toHaveBeenCalled();
    });

    it('should call securityTicketServiceMock.getSecurityTicketData() with identityMock, fraudCaseMock and fraudTracksMock,', async () => {
      // When
      await service['buildSecurityTicketContext'](
        identityMock,
        fraudCaseMock,
        accountIdsMock,
        groupIdsMock,
      );

      // Then
      expect(getSecurityTicketData).toHaveBeenCalledTimes(1);
      expect(getSecurityTicketData).toHaveBeenCalledWith(
        identityMock,
        fraudCaseMock,
        groupIdsMock,
        [fraudTrackMock],
      );
    });

    it('should call securityTicketServiceMock.getSecurityTicketData() with empty accountIds list if getAccountIdsFromIdentity failed', async () => {
      // Given
      accountServiceMock.getAccountIdsFromIdentity.mockImplementationOnce(
        () => {
          throw errorMock;
        },
      );

      // When
      await service['buildSecurityTicketContext'](
        identityMock,
        fraudCaseMock,
        accountIdsMock,
        groupIdsMock,
      );

      // Then
      expect(getSecurityTicketData).toHaveBeenCalledTimes(1);
      expect(getSecurityTicketData).toHaveBeenCalledWith(
        identityMock,
        fraudCaseMock,
        groupIdsMock,
        [fraudTrackMock],
      );
    });

    it('should call securityTicketServiceMock.getTrackingData() with fraudCaseMock and fraudTracksMock', async () => {
      // When
      await service['buildSecurityTicketContext'](
        identityMock,
        fraudCaseMock,
        accountIdsMock,
        groupIdsMock,
      );

      // Then
      expect(getTrackingData).toHaveBeenCalledTimes(1);
      expect(getTrackingData).toHaveBeenCalledWith(
        fraudCaseMock,
        accountIdsMock,
        [fraudTrackMock],
      );
    });

    it('should return ticket and tracking data', async () => {
      // When
      const result = await service['buildSecurityTicketContext'](
        identityMock,
        fraudCaseMock,
        accountIdsMock,
        groupIdsMock,
      );

      // Then
      expect(result).toEqual({
        ticketData: ticketDataMock,
        trackingData: trackingDataMock,
      });
    });
  });

  describe('fetchFraudTracks', () => {
    beforeEach(() => {
      tracksServiceMock.getTracksForAuthenticationEventId.mockResolvedValue(
        tracksMock,
      );
    });

    it('should call tracksServiceMock.getTracksForAuthenticationEventId() with authenticationEventId', async () => {
      // When
      await service['fetchFraudTracks'](authenticationEventIdMock);

      // Then
      expect(
        tracksServiceMock.getTracksForAuthenticationEventId,
      ).toHaveBeenCalledExactlyOnceWith(authenticationEventIdMock);
    });

    it('should return fraudTracks', async () => {
      // When
      const result = await service['fetchFraudTracks'](
        authenticationEventIdMock,
      );

      // Then
      expect(result).toStrictEqual(tracksMock.payload);
    });
  });
});
