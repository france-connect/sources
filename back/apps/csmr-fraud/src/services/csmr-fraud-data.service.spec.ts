import { Test, TestingModule } from '@nestjs/testing';

import { CsmrFraudDataService } from './csmr-fraud-data.service';

describe('CsmrFraudDataService', () => {
  let service: CsmrFraudDataService;

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

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrFraudDataService],
    }).compile();

    service = module.get<CsmrFraudDataService>(CsmrFraudDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enrichFraudData', () => {
    it('should return ticket data', () => {
      // When
      const result = service.enrichFraudData(identityMock, fraudCaseMock);

      // Then
      expect(result).toEqual(ticketDataMock);
    });
  });
});
