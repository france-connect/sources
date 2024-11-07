import { lastValueFrom } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { FraudProtocol } from '@fc/microservices';

import { CsmrFraudClientResponseException } from '../exceptions';
import { CsmrFraudClientService } from './csmr-fraud-client.service';

jest.mock('rxjs');
jest.mock('@fc/common');

describe('CsmrFraudClientService', () => {
  let service: CsmrFraudClientService;

  const lastValueFromMock = jest.mocked(lastValueFrom);

  const configServiceMock = {
    get: jest.fn(),
  };

  const brokerMock = {
    close: jest.fn(),
    connect: jest.fn(),
    send: jest.fn(),
  };

  const messageMock = {
    pipe: jest.fn(),
  };

  const pipeMock = {};
  const brokerResponseMock = 'brokerResponseMock';

  const identityMock = {
    given_name: 'firstname',
    family_name: 'lastname',
    birthdate: 'birthdate',
    gender: 'gender',
    birthplace: 'birthplace',
    birthcountry: 'birthcountry',
  };

  const fraudCaseMock = {
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@idp.fr',
    authenticationEventId: '1a344d7d-fb1f-432f-99df-01b374c93687',
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrFraudClientService,
        ConfigService,
        {
          provide: 'FraudBroker',
          useValue: brokerMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CsmrFraudClientService>(CsmrFraudClientService);

    configServiceMock.get.mockReturnValue({ requestTimeout: 200 });

    brokerMock.send.mockReturnValue(messageMock);
    messageMock.pipe.mockReturnValue(pipeMock);
    lastValueFromMock.mockResolvedValue(brokerResponseMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processFraudCase', () => {
    it('should call config.get', async () => {
      // When
      await service.processFraudCase(identityMock, fraudCaseMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('FraudBroker');
    });

    it('should call broker.send with correct payload', async () => {
      // When
      await service.processFraudCase(identityMock, fraudCaseMock);

      // Then
      expect(brokerMock.send).toHaveBeenCalledTimes(1);
      expect(brokerMock.send).toHaveBeenCalledWith(
        FraudProtocol.Commands.PROCESS_FRAUD_CASE,
        {
          identity: identityMock,
          fraudCase: fraudCaseMock,
        },
      );
    });

    it('should resolve when result is "SUCCESS"', async () => {
      // Given
      lastValueFromMock.mockResolvedValueOnce('SUCCESS');

      // When
      await expect(
        service.processFraudCase(identityMock, fraudCaseMock),
      ).resolves.toBeUndefined();
    });

    it('should throw an error if result is "ERROR"', async () => {
      // Given
      lastValueFromMock.mockResolvedValueOnce('ERROR');

      // When / Then
      await expect(
        service.processFraudCase(identityMock, fraudCaseMock),
      ).rejects.toThrow(CsmrFraudClientResponseException);
    });

    it('should throw CsmrFraudClientResponseException on exception', async () => {
      // Given
      const errorMock = new Error('Timeout');
      lastValueFromMock.mockRejectedValueOnce(errorMock);

      // When / Then
      await expect(
        service.processFraudCase(identityMock, fraudCaseMock),
      ).rejects.toThrow(CsmrFraudClientResponseException);
    });
  });
});
