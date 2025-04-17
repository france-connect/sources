import { Test, TestingModule } from '@nestjs/testing';

import { FraudMessageDto, TrackingDataDto } from '@fc/csmr-fraud-client';
import { MicroservicesRmqSubscriberService } from '@fc/microservices-rmq';

import { getSubscriberMock } from '@mocks/microservices-rmq';

import { SecurityTicketDataInterface } from '../interfaces';
import { CsmrFraudDataService, CsmrFraudSupportService } from '../services';
import { CsmrFraudController } from './csmr-fraud.controller';

describe('CsmrFraudController', () => {
  let controller: CsmrFraudController;

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
    authenticationEventId: '1a344d7d-fb1f-432f-99df-01b374c93687',
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

  const supportServiceMock = {
    createSecurityTicket: jest.fn(),
  };

  const dataServiceMock = {
    enrichFraudData: jest.fn(),
  };

  const subscriberMock = getSubscriberMock();

  const messageMock = {
    type: 'MOCK',
    meta: { id: 'meta-mock' },
    payload: { fraudCase: fraudCaseMock, identity: identityMock },
  } as unknown as FraudMessageDto;

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

    subscriberMock.response.mockReturnValue(responseMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processFraudCase', () => {
    it('should call data.enrichFraudData with correct parameters', async () => {
      // When
      await controller.processFraudCase(messageMock);

      // Then
      expect(dataServiceMock.enrichFraudData).toHaveBeenCalledOnce();
      expect(dataServiceMock.enrichFraudData).toHaveBeenCalledWith(
        identityMock,
        fraudCaseMock,
      );
    });

    it('should call support.createSecurityTicket with ticketData', async () => {
      // When
      await controller.processFraudCase(messageMock);
      // Then
      expect(supportServiceMock.createSecurityTicket).toHaveBeenCalledOnce();
      expect(supportServiceMock.createSecurityTicket).toHaveBeenCalledWith(
        ticketDataMock,
      );
    });

    it('should call subscriber.response with trackingData', async () => {
      // When
      await controller.processFraudCase(messageMock);
      // Then
      expect(subscriberMock.response).toHaveBeenCalledOnce();
      expect(subscriberMock.response).toHaveBeenCalledWith(trackingDataMock);
    });

    it('should return result of subscriber.response()', async () => {
      // When
      const result = await controller.processFraudCase(messageMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });
});
