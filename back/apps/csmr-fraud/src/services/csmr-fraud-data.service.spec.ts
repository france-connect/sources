import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import {
  TracksResultsInterface,
  TracksTicketDataInterface,
} from '../interfaces';
import { CsmrFraudDataService } from './csmr-fraud-data.service';
import { CsmrFraudTracksService } from './csmr-fraud-tracks.service';

describe('CsmrFraudDataService', () => {
  let service: CsmrFraudDataService;

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

  const fraudCaseMock = {
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@fi.fr',
    authenticationEventId: '1a344d7d-fb1f-432f-99df-01b374c93687',
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
  };

  const errorMock = Symbol('error') as unknown as string;

  const totalMock = 42;

  const trackMock = Symbol('track') as unknown as TracksTicketDataInterface;

  const tracksResults: TracksResultsInterface = {
    tracks: [trackMock],
    error: errorMock,
    total: totalMock,
  };

  const ticketDataMock = {
    givenName: 'firstName',
    familyName: 'lastName',
    birthdate: 'birthdate',
    birthplace: 'birthplace',
    birthcountry: 'birthcountry',
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@fi.fr',
    authenticationEventId: '1a344d7d-fb1f-432f-99df-01b374c93687',
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
    error: errorMock,
    total: totalMock,
    tracks: [trackMock],
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrFraudDataService, CsmrFraudTracksService, LoggerService],
    })
      .overrideProvider(CsmrFraudTracksService)
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
      tracksServiceMock.getTracksForAuthenticationEventId.mockResolvedValue(
        tracksResults,
      );
    });

    it('should call getTracksForAuthenticationEventId with correct parameters', async () => {
      // When
      await service.enrichFraudData(identityMock, fraudCaseMock);

      // Then
      expect(
        tracksServiceMock.getTracksForAuthenticationEventId,
      ).toHaveBeenCalledTimes(1);

      expect(
        tracksServiceMock.getTracksForAuthenticationEventId,
      ).toHaveBeenCalledWith(identityMock, fraudCaseMock.authenticationEventId);
    });

    it('should return ticket data', async () => {
      // When
      const result = await service.enrichFraudData(identityMock, fraudCaseMock);

      // Then
      expect(result).toEqual(ticketDataMock);
    });

    it('should call logger.debug with error', async () => {
      // Given
      const resultWithError = { error: 'message' };
      tracksServiceMock.getTracksForAuthenticationEventId.mockResolvedValueOnce(
        resultWithError,
      );

      // When
      await service.enrichFraudData(identityMock, fraudCaseMock);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledOnce();
      expect(loggerMock.debug).toHaveBeenCalledWith(`message`);
    });
  });
});
