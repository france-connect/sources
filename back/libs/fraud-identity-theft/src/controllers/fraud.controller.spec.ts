import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { getTransformed } from '@fc/common';
import { ActionTypes, TrackingDataDto } from '@fc/csmr-fraud-client';
import { CsrfTokenGuard } from '@fc/csrf';
import {
  Dto2FormI18nService,
  FormValidationPipe,
  MetadataFormService,
} from '@fc/dto2form';
import { TrackingService } from '@fc/tracking';

import {
  formValidationPipeMock,
  metadataFormServiceMock,
} from '@mocks/dto2form';
import { getSessionServiceMock } from '@mocks/session';

import {
  FraudConnectionFormDto,
  FraudContactFormDto,
  FraudDescriptionFormDto,
  FraudIdentityFormDto,
} from '../dto';
import { FraudIdentityTheftService } from '../services';
import { FraudController } from './fraud.controller';

jest.mock('uuid');
jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  getTransformed: jest.fn(),
}));

describe('FraudController', () => {
  let controller: FraudController;

  const getTransformedMock = jest.mocked(getTransformed);

  const uuidMockedValue = 'uuid-v4-Mocked-Value' as unknown as Uint8Array;

  const sessionServiceMock = getSessionServiceMock();
  const identityMock = {
    email: 'email@email.fr',
    given_name: 'givenName',
    family_name: 'familyName',
    sub: 'identityMock.sub value',
    idp_id: '8dfc4080-c90d-4234-969b-f6c961de3e90',
  };

  const { idp_id: _idpId, ...identityWithoutIdpIdMock } = identityMock;

  const csmrFraudClientMock = {
    publish: jest.fn(),
  };

  const fraudIdentityTheftServiceMock = {
    transformToPivotIdentity: jest.fn(),
    buildFraudCase: jest.fn(),
  };

  const resMock = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
  };

  const reqMock = {} as Request;

  const identitePivotMock = {
    given_name: 'test-given',
    family_name: 'test-family',
    birthdate: '01-01-2000',
    birthplace: '75112',
    birthcountry: '99100',
    gender: 'male',
  };

  const processFraudFormBodyMock = {
    contactEmail: 'email@mock.fr',
    idpEmail: 'email@idp.fr',
    authenticationEventId: '1a344d7d-fb1f-432f-99df-01b374c93687',
    fraudSurveyOrigin: 'fraudSurveyOriginMock',
    comment: 'commentMock',
    phoneNumber: '0678912345',
  };

  const fraudVerifiedMessageMock = {
    type: ActionTypes.PROCESS_VERIFIED_IDENTITY_FRAUD_CASE,
    payload: {
      identity: identityWithoutIdpIdMock,
      fraudCase: {
        ...processFraudFormBodyMock,
        id: uuidMockedValue,
      },
    },
  };

  const fraudUnverifiedMessageMock = {
    type: ActionTypes.PROCESS_UNVERIFIED_IDENTITY_FRAUD_CASE,
    payload: {
      identity: identitePivotMock,
      fraudCase: {
        ...processFraudFormBodyMock,
        id: uuidMockedValue,
      },
    },
  };

  const trackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      UPDATED_USER_PREFERENCES: {},
      UPDATED_USER_PREFERENCES_FUTURE_IDP: {},
      UPDATED_USER_PREFERENCES_IDP: {},
      FRAUD_CASE_OPENED: {},
    },
  };

  const guardMock = { canActivate: jest.fn() };

  const metadataMock = { form: 'metadata' };

  const dto2FormI18nServiceMock = { translation: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FraudController],
      providers: [
        {
          provide: 'Fraud',
          useValue: csmrFraudClientMock,
        },
        TrackingService,
        MetadataFormService,
        FraudIdentityTheftService,
        Dto2FormI18nService,
      ],
    })
      .overrideProvider(TrackingService)
      .useValue(trackingService)
      .overrideProvider(MetadataFormService)
      .useValue(metadataFormServiceMock)
      .overrideProvider(Dto2FormI18nService)
      .useValue(dto2FormI18nServiceMock)
      .overrideGuard(CsrfTokenGuard)
      .useValue(guardMock)
      .overridePipe(FormValidationPipe)
      .useValue(formValidationPipeMock)
      .overrideProvider(FraudIdentityTheftService)
      .useValue(fraudIdentityTheftServiceMock)
      .compile();

    controller = module.get<FraudController>(FraudController);

    resMock.json.mockImplementationOnce((arg) => arg);
    sessionServiceMock.get.mockReturnValue(identityMock);
    getTransformedMock.mockReturnValueOnce(identityWithoutIdpIdMock);
    metadataFormServiceMock.getDtoMetadata.mockReturnValue(metadataMock);

    jest.mocked(uuid).mockReturnValueOnce(uuidMockedValue);
    jest.mocked(resMock.status).mockReturnValue(resMock);

    dto2FormI18nServiceMock.translation.mockImplementation((key) => key);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFraudDescription', () => {
    beforeEach(() => {
      metadataFormServiceMock.getDtoMetadata.mockReturnValue(metadataMock);
    });

    it('should call getDtoMetadata with FraudDescriptionFormDto', () => {
      // When
      controller.getFraudDescription();

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudDescriptionFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudDescription();

      // Then
      expect(result).toBe(metadataMock);
    });
  });

  describe('postFraudDescription', () => {
    const descriptionMock = { description: 'test description' };

    it('should save description in session', () => {
      // When
      controller.postFraudDescription(
        resMock,
        descriptionMock,
        sessionServiceMock,
      );

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith({
        description: descriptionMock,
      });
    });

    it('should return success response', () => {
      // When
      controller.postFraudDescription(
        resMock,
        descriptionMock,
        sessionServiceMock,
      );

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(200);
      expect(resMock.send).toHaveBeenCalledOnce();
    });
  });

  describe('getFraudConnection', () => {
    it('should call getDtoMetadata with FraudConnectionFormDto', () => {
      // When
      controller.getFraudConnection(sessionServiceMock);

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudConnectionFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudConnection(sessionServiceMock);

      // Then
      expect(result).toBe(metadataMock);
    });
  });

  describe('postFraudConnection', () => {
    const connectionMock = { code: 'test-code' };

    it('should save connection in session', () => {
      // When
      controller.postFraudConnection(
        resMock,
        connectionMock,
        sessionServiceMock,
      );

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith({
        connection: connectionMock,
      });
    });

    it('should return success response', () => {
      // When
      controller.postFraudConnection(
        resMock,
        connectionMock,
        sessionServiceMock,
      );

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(200);
      expect(resMock.send).toHaveBeenCalledOnce();
    });
  });

  describe('getFraudIdentity', () => {
    it('should call getDtoMetadata with FraudIdentityFormDto', () => {
      // When
      controller.getFraudIdentity(sessionServiceMock);

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudIdentityFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudIdentity(sessionServiceMock);

      // Then
      expect(result).toBe(metadataMock);
    });
  });

  describe('postFraudIdentity', () => {
    const identityMock = {
      family_name: 'test-family',
      given_name: 'test-given',
      rawBirthdate: '01-01-2000',
      rawBirthcountry: 'FR',
      rawBirthplace: 'Paris',
    };

    it('should save identity in session', () => {
      // When
      controller.postFraudIdentity(resMock, identityMock, sessionServiceMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith({
        identity: identityMock,
      });
    });

    it('should return success response', () => {
      // When
      controller.postFraudIdentity(resMock, identityMock, sessionServiceMock);

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(200);
      expect(resMock.send).toHaveBeenCalledOnce();
    });
  });

  describe('getFraudContact', () => {
    it('should call getDtoMetadata with FraudContactFormDto', () => {
      // When
      controller.getFraudContact(sessionServiceMock);

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudContactFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudContact(sessionServiceMock);

      // Then
      expect(result).toBe(metadataMock);
    });
  });

  describe('postFraudContact', () => {
    const contactMock = {
      email: 'test@test.fr',
      phone: '0123456789',
    };

    it('should save contact in session', () => {
      // When
      controller.postFraudContact(resMock, contactMock, sessionServiceMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith({
        contact: contactMock,
      });
    });

    it('should return success response', () => {
      // When
      controller.postFraudContact(resMock, contactMock, sessionServiceMock);

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(200);
      expect(resMock.send).toHaveBeenCalledOnce();
    });
  });

  describe('getFraudSummaryData', () => {
    const summaryMock = {
      description: { description: 'test' },
      connection: { code: 'test' },
      identity: { family_name: 'test' },
      contact: { email: 'test@test.fr' },
    };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue(summaryMock);
    });

    it('should get summary from session', () => {
      // When
      controller.getFraudSummaryData(sessionServiceMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledOnce();
    });

    it('should return summary data', () => {
      // When
      const result = controller.getFraudSummaryData(sessionServiceMock);

      // Then
      expect(result).toStrictEqual({
        form: metadataMock,
        summary: summaryMock,
      });
    });
  });

  describe('postFraudSummary', () => {
    const summaryMock = {
      description: { description: 'test' },
      connection: { code: 'test' },
      identity: { family_name: 'test' },
      contact: { email: 'test@test.fr' },
    };

    const fraudSummaryBodyMock = {
      consent: true,
    };

    const fraudCaseTrackingDataMock = Symbol(
      'fraudCaseTrackingDataMock',
    ) as unknown as TrackingDataDto;

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue(summaryMock);
      fraudIdentityTheftServiceMock.transformToPivotIdentity.mockReturnValueOnce(
        identitePivotMock,
      );
      fraudIdentityTheftServiceMock.buildFraudCase.mockReturnValueOnce({
        ...processFraudFormBodyMock,
        id: uuidMockedValue,
      });
      csmrFraudClientMock.publish.mockResolvedValue({
        payload: fraudCaseTrackingDataMock,
      });
    });

    it('should call transformToPivotIdentity to get unverified pivot identity', async () => {
      // When
      await controller.postFraudSummary(
        reqMock,
        resMock,
        fraudSummaryBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(
        fraudIdentityTheftServiceMock.transformToPivotIdentity,
      ).toHaveBeenCalledExactlyOnceWith(summaryMock.identity);
    });

    it('should call buildFraudCase', async () => {
      // When
      await controller.postFraudSummary(
        reqMock,
        resMock,
        fraudSummaryBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(
        fraudIdentityTheftServiceMock.buildFraudCase,
      ).toHaveBeenCalledExactlyOnceWith(summaryMock);
    });

    it('should call csmrFraudClient.publish', async () => {
      // When
      await controller.postFraudSummary(
        reqMock,
        resMock,
        fraudSummaryBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(csmrFraudClientMock.publish).toHaveBeenCalledExactlyOnceWith(
        fraudUnverifiedMessageMock,
      );
    });

    it('should track the fraud case opened event', async () => {
      // When
      await controller.postFraudSummary(
        reqMock,
        resMock,
        fraudSummaryBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(trackingService.track).toHaveBeenCalledExactlyOnceWith(
        trackingService.TrackedEventsMap.FRAUD_CASE_OPENED,
        {
          req: reqMock,
          identity: identitePivotMock,
          fraudCaseContext: {
            isAuthenticated: false,
            ...fraudCaseTrackingDataMock,
          },
        },
      );
    });

    it('should return success status', async () => {
      // When
      await controller.postFraudSummary(
        reqMock,
        resMock,
        fraudSummaryBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(200);
    });
  });

  describe('processFraudForm', () => {
    const fraudCaseTrackingDataMock = Symbol(
      'fraudCaseTrackingDataMock',
    ) as unknown as TrackingDataDto;

    beforeEach(() => {
      csmrFraudClientMock.publish.mockResolvedValue({
        payload: fraudCaseTrackingDataMock,
      });
    });

    it('should fetch session', async () => {
      // When
      await controller.processFraudForm(
        resMock,
        reqMock,
        processFraudFormBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        'idpIdentity',
      );
    });

    it('should return a 401 if no session', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(undefined);

      // When
      await controller.processFraudForm(
        resMock,
        reqMock,
        processFraudFormBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(401);
      expect(resMock.send).toHaveBeenCalledExactlyOnceWith({
        code: 'INVALID_SESSION',
      });
    });

    it('should call csmrFraudClient.publish', async () => {
      // When
      await controller.processFraudForm(
        resMock,
        reqMock,
        processFraudFormBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(csmrFraudClientMock.publish).toHaveBeenCalledExactlyOnceWith(
        fraudVerifiedMessageMock,
      );
    });

    it('should call tracking.track() with right parameters', async () => {
      //Given
      const fraudCaseContextMock = {
        isAuthenticated: true,
        ...fraudCaseTrackingDataMock,
      };

      // When
      await controller.processFraudForm(
        resMock,
        reqMock,
        processFraudFormBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(controller['tracking'].track).toHaveBeenCalledExactlyOnceWith(
        trackingService.TrackedEventsMap.FRAUD_CASE_OPENED,
        {
          req: reqMock,
          identity: identityMock,
          fraudCaseContext: fraudCaseContextMock,
        },
      );
    });

    it('should return a 200', async () => {
      // When
      await controller.processFraudForm(
        resMock,
        reqMock,
        processFraudFormBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.send).toHaveBeenCalledOnce();
    });
  });
});
