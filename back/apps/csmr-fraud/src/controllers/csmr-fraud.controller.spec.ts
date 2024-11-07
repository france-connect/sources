import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { FraudProtocol } from '@fc/microservices';

import { getLoggerMock } from '@mocks/logger';

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
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@fi.fr',
    authenticationEventId: '1a344d7d-fb1f-432f-99df-01b374c93687',
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
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
  };

  const loggerMock = getLoggerMock();

  const supportServiceMock = {
    createSecurityTicket: jest.fn(),
  };

  const dataServiceMock = {
    enrichFraudData: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrFraudController],
      providers: [CsmrFraudSupportService, CsmrFraudDataService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrFraudSupportService)
      .useValue(supportServiceMock)
      .overrideProvider(CsmrFraudDataService)
      .useValue(dataServiceMock)
      .compile();

    controller = app.get<CsmrFraudController>(CsmrFraudController);
    dataServiceMock.enrichFraudData.mockReturnValue(ticketDataMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('processFraudCase', () => {
    it('should log a debug message with the correct pattern', async () => {
      // When
      await controller.processFraudCase({
        identity: identityMock,
        fraudCase: fraudCaseMock,
      });

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        `New message received with pattern "${FraudProtocol.Commands.PROCESS_FRAUD_CASE}"`,
      );
    });

    it('should call data.enrichFraudData with correct parameters', async () => {
      // When
      await controller.processFraudCase({
        identity: identityMock,
        fraudCase: fraudCaseMock,
      });

      // Then
      expect(dataServiceMock.enrichFraudData).toHaveBeenCalledOnce();
      expect(dataServiceMock.enrichFraudData).toHaveBeenCalledWith(
        identityMock,
        fraudCaseMock,
      );
    });

    it('should call support.createSecurityTicket with correct parameters', async () => {
      // When
      await controller.processFraudCase({
        identity: identityMock,
        fraudCase: fraudCaseMock,
      });

      // Then
      expect(supportServiceMock.createSecurityTicket).toHaveBeenCalledOnce();
      expect(supportServiceMock.createSecurityTicket).toHaveBeenCalledWith(
        ticketDataMock,
      );
    });

    it('should return "SUCCESS" when support.createSecurityTicket resolves', async () => {
      // Given
      supportServiceMock.createSecurityTicket.mockResolvedValueOnce(undefined);

      // When
      const result = await controller.processFraudCase({
        identity: identityMock,
        fraudCase: fraudCaseMock,
      });

      // Then
      expect(result).toBe('SUCCESS');
    });

    it('should call logger.err when support.createSecurityTicket rejects', async () => {
      // Given
      const errorMock = new Error('some error');
      supportServiceMock.createSecurityTicket.mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      await controller.processFraudCase({
        identity: identityMock,
        fraudCase: fraudCaseMock,
      });

      // Then
      expect(loggerMock.err).toHaveBeenCalledTimes(1);
    });

    it('should return "ERROR" when support.createSecurityTicket rejects', async () => {
      // Given
      const errorMock = new Error('some error');
      supportServiceMock.createSecurityTicket.mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      const result = await controller.processFraudCase({
        identity: identityMock,
        fraudCase: fraudCaseMock,
      });

      // Then
      expect(result).toBe('ERROR');
    });
  });
});
