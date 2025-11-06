import { Test, TestingModule } from '@nestjs/testing';

import {
  FraudCaseMessageDto,
  FraudTrackDto,
  FraudTracksMessageDto,
  TrackingDataDto,
} from '@fc/csmr-fraud-client/protocol';
import { MicroservicesRmqSubscriberService } from '@fc/microservices-rmq';

import { getSubscriberMock } from '@mocks/microservices-rmq';

import { SecurityTicketDataInterface } from '../interfaces';
import { CsmrFraudDataService, CsmrFraudSupportService } from '../services';
import { CsmrFraudController } from './csmr-fraud.controller';

describe('CsmrFraudController', () => {
  let controller: CsmrFraudController;

  const authenticationEventIdMock = '1a344d7d-fb1f-432f-99df-01b374c93687';

  const identityMock = {
    given_name: 'firstName',
    family_name: 'lastName',
    birthdate: 'birthdate',
    gender: 'gender',
    birthplace: 'birthplace',
    birthcountry: 'birthcountry',
  };

  const fraudCaseMock = {
    fraudCaseId: 'fraudCaseIdMock',
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@fi.fr',
    authenticationEventId: authenticationEventIdMock,
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
  };

  const ticketDataMock = Symbol(
    'ticketDataMock',
  ) as unknown as SecurityTicketDataInterface;

  const trackingDataMock = Symbol(
    'trackingDataMock',
  ) as unknown as TrackingDataDto;

  const fraudTrackMock = Symbol(
    'fraudConnexionMock',
  ) as unknown as FraudTrackDto;

  const supportServiceMock = {
    createSecurityTicket: jest.fn(),
  };

  const dataServiceMock = {
    enrichFraudData: jest.fn(),
    enrichUnverifiedIdentityFraudData: jest.fn(),
    fetchFraudTracks: jest.fn(),
  };

  const subscriberMock = getSubscriberMock();

  const fraudCaseMessageMock = {
    type: 'MOCK',
    meta: { id: 'meta-mock' },
    payload: { fraudCase: fraudCaseMock, identity: identityMock },
  } as unknown as FraudCaseMessageDto;

  const fraudTracksMesssageMock = {
    type: 'MOCK',
    meta: { id: 'meta-mock' },
    payload: { authenticationEventId: authenticationEventIdMock },
  } as unknown as FraudTracksMessageDto;

  const responseMock = Symbol('responseMock');

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrFraudController,
        CsmrFraudDataService,
        CsmrFraudSupportService,
        MicroservicesRmqSubscriberService,
      ],
    })

      .overrideProvider(CsmrFraudSupportService)
      .useValue(supportServiceMock)
      .overrideProvider(CsmrFraudDataService)
      .useValue(dataServiceMock)
      .overrideProvider(MicroservicesRmqSubscriberService)
      .useValue(subscriberMock)
      .compile();

    controller = app.get<CsmrFraudController>(CsmrFraudController);
    dataServiceMock.enrichFraudData.mockReturnValue({
      ticketData: ticketDataMock,
      trackingData: trackingDataMock,
    });

    dataServiceMock.enrichUnverifiedIdentityFraudData.mockReturnValue({
      ticketData: ticketDataMock,
      trackingData: trackingDataMock,
    });

    dataServiceMock.fetchFraudTracks.mockReturnValue([fraudTrackMock]);

    subscriberMock.response.mockReturnValue(responseMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processFraudCase', () => {
    it('should call data.enrichFraudData with correct parameters', async () => {
      // When
      await controller.processFraudCase(fraudCaseMessageMock);

      // Then
      expect(dataServiceMock.enrichFraudData).toHaveBeenCalledExactlyOnceWith(
        identityMock,
        fraudCaseMock,
      );
    });

    it('should call support.createSecurityTicket with ticketData', async () => {
      // When
      await controller.processFraudCase(fraudCaseMessageMock);

      // Then
      expect(
        supportServiceMock.createSecurityTicket,
      ).toHaveBeenCalledExactlyOnceWith(ticketDataMock);
    });

    it('should call subscriber.response with trackingData', async () => {
      // When
      await controller.processFraudCase(fraudCaseMessageMock);

      // Then
      expect(subscriberMock.response).toHaveBeenCalledExactlyOnceWith(
        trackingDataMock,
      );
    });

    it('should return result of subscriber.response()', async () => {
      // When
      const result = await controller.processFraudCase(fraudCaseMessageMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('processUnverifiedFraudCase', () => {
    it('should call data.enrichUnverifiedIdentityFraudData with correct parameters', async () => {
      // When
      await controller.processUnverifiedFraudCase(fraudCaseMessageMock);

      // Then
      expect(
        dataServiceMock.enrichUnverifiedIdentityFraudData,
      ).toHaveBeenCalledExactlyOnceWith(identityMock, fraudCaseMock);
    });

    it('should call support.createSecurityTicket with ticketData', async () => {
      // When
      await controller.processUnverifiedFraudCase(fraudCaseMessageMock);

      // Then
      expect(
        supportServiceMock.createSecurityTicket,
      ).toHaveBeenCalledExactlyOnceWith(ticketDataMock);
    });

    it('should call subscriber.response with trackingData', async () => {
      // When
      await controller.processUnverifiedFraudCase(fraudCaseMessageMock);

      // Then
      expect(subscriberMock.response).toHaveBeenCalledExactlyOnceWith(
        trackingDataMock,
      );
    });

    it('should return result of subscriber.response()', async () => {
      // When
      const result =
        await controller.processUnverifiedFraudCase(fraudCaseMessageMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('getFraudTracks', () => {
    it('should call data.fetchFraudTracks with the authenticationEventId', async () => {
      // When
      await controller.getFraudTracks(fraudTracksMesssageMock);

      // Then
      expect(dataServiceMock.fetchFraudTracks).toHaveBeenCalledExactlyOnceWith(
        authenticationEventIdMock,
      );
    });

    it('should call subscriber.response with fraudTracks', async () => {
      // When
      await controller.getFraudTracks(fraudTracksMesssageMock);

      // Then
      expect(subscriberMock.response).toHaveBeenCalledExactlyOnceWith([
        fraudTrackMock,
      ]);
    });

    it('should return result of subscriber.response()', async () => {
      // When
      const result = await controller.getFraudTracks(fraudTracksMesssageMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });
});
