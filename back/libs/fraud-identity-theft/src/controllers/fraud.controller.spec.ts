import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { getTransformed } from '@fc/common';
import {
  ActionTypes,
  FraudTrackDto,
  SanitizedTrackDto,
  TrackingDataDto,
} from '@fc/csmr-fraud-client';
import { CsrfTokenGuard } from '@fc/csrf';
import {
  Dto2FormI18nService,
  FormValidationPipe,
  MessageLevelEnum,
  MessagePriorityEnum,
  MetadataFormService,
} from '@fc/dto2form';
import { Dto2FormValidationErrorException } from '@fc/dto2form/exceptions';
import { TrackingService } from '@fc/tracking';

import {
  formValidationPipeMock,
  metadataFormServiceMock,
} from '@mocks/dto2form';
import { getSessionServiceMock } from '@mocks/session';

import {
  FraudConnectionFormDto,
  FraudConnectionSessionDto,
  FraudContactFormDto,
  FraudDescriptionFormDto,
  FraudDescriptionSessionDto,
  FraudIdentityFormDto,
  FraudIdentitySessionDto,
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

  const csmrFraudClientMock = {
    publishFraudCase: jest.fn(),
    publishFraudTracks: jest.fn(),
  };

  const fraudIdentityTheftServiceMock = {
    transformToPivotIdentity: jest.fn(),
    buildFraudCase: jest.fn(),
    sanitizeFraudTracks: jest.fn(),
    buildFraudSummary: jest.fn(),
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

  const fraudTrackMock = Symbol(
    'fraudConnexionMock',
  ) as unknown as FraudTrackDto;

  const sanitizeTrackMock = Symbol(
    'sanitizeTrackMock',
  ) as unknown as SanitizedTrackDto;

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
    metadataFormServiceMock.getDtoMetadata.mockReturnValue(metadataMock);

    jest.mocked(uuid).mockReturnValueOnce(uuidMockedValue);
    jest.mocked(resMock.status).mockReturnValue(resMock);

    dto2FormI18nServiceMock.translation.mockImplementation((key) => key);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFraudDescriptionForm', () => {
    beforeEach(() => {
      metadataFormServiceMock.getDtoMetadata.mockReturnValue(metadataMock);
    });

    it('should call getDtoMetadata with FraudDescriptionFormDto', () => {
      // When
      controller.getFraudDescriptionForm();

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudDescriptionFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudDescriptionForm();

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

  describe('getFraudConnectionForm', () => {
    it('should call getDtoMetadata with FraudConnectionFormDto', () => {
      // When
      controller.getFraudConnectionForm(sessionServiceMock);

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudConnectionFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudConnectionForm(sessionServiceMock);

      // Then
      expect(result).toBe(metadataMock);
    });
  });

  describe('getFraudTracks', () => {
    const connectionMock = { code: 'test' };
    const fraudTracksMock = [fraudTrackMock];

    beforeEach(() => {
      sessionServiceMock.get
        .mockReturnValueOnce(connectionMock)
        .mockReturnValueOnce(fraudTracksMock);

      fraudIdentityTheftServiceMock.sanitizeFraudTracks.mockReturnValueOnce([
        sanitizeTrackMock,
      ]);
    });

    it('should get code and fraud tracks from session', () => {
      // When
      controller.getFraudTracks(sessionServiceMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledWith('connection');
      expect(sessionServiceMock.get).toHaveBeenCalledWith('fraudTracks');
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(2);
    });

    it('should sanitize fraudTracks', () => {
      // When
      controller.getFraudTracks(sessionServiceMock);

      // Then
      expect(
        fraudIdentityTheftServiceMock.sanitizeFraudTracks,
      ).toHaveBeenCalledExactlyOnceWith(fraudTracksMock);
    });

    it('should return the connection code and the sanitized tracks', () => {
      // When
      const result = controller.getFraudTracks(sessionServiceMock);

      // Then
      expect(result).toStrictEqual({
        meta: { code: 'test' },
        payload: [sanitizeTrackMock],
      });
    });
  });

  describe('postFraudConnection', () => {
    const connectionMock = { code: 'test' };

    beforeEach(() => {
      controller['getTracks'] = jest
        .fn()
        .mockResolvedValueOnce([fraudTrackMock]);
    });

    it('should save connection in session', async () => {
      // When
      await controller.postFraudConnection(
        resMock,
        connectionMock,
        sessionServiceMock,
      );

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        connection: connectionMock,
      });
    });

    it('should save tracks', async () => {
      // When
      await controller.postFraudConnection(
        resMock,
        connectionMock,
        sessionServiceMock,
      );

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        fraudTracks: [fraudTrackMock],
      });
    });

    it('should return success response when tracks are found', async () => {
      // When
      await controller.postFraudConnection(
        resMock,
        connectionMock,
        sessionServiceMock,
      );

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(200);
      expect(resMock.send).toHaveBeenCalledOnce();
    });

    it('should throw a Dto2FormValidationErrorException if no tracks are found', async () => {
      // Given
      controller['getTracks'] = jest.fn().mockResolvedValueOnce([]);
      const expectedError = new Dto2FormValidationErrorException([
        {
          name: 'code',
          validators: [
            {
              name: 'isWrong',
              errorMessage: {
                content: 'isWrong_error',
                level: MessageLevelEnum.ERROR,
                priority: MessagePriorityEnum.ERROR,
              },
              validationArgs: [],
            },
          ],
        },
      ]);

      // When
      const promise = controller.postFraudConnection(
        resMock,
        connectionMock,
        sessionServiceMock,
      );

      // Then
      await expect(promise).rejects.toThrow(Dto2FormValidationErrorException);
      await expect(promise).rejects.toEqual(expectedError);
    });
  });

  describe('getTracks', () => {
    beforeEach(() => {
      csmrFraudClientMock.publishFraudTracks.mockResolvedValueOnce({
        payload: [fraudTrackMock],
      });
    });

    it('should call publishFraudTracks with the authenticationEventId', async () => {
      // Given
      const fraudTracksMessageMock = {
        type: ActionTypes.GET_FRAUD_TRACKS,
        payload: {
          authenticationEventId: 'test',
        },
      };

      // When
      await controller['getTracks']('test');

      // Then
      expect(
        csmrFraudClientMock.publishFraudTracks,
      ).toHaveBeenCalledExactlyOnceWith(fraudTracksMessageMock);
    });

    it('should return the fraud tracks', async () => {
      // When
      const result = await controller['getTracks']('test');

      // Then
      expect(result).toStrictEqual([fraudTrackMock]);
    });
  });

  describe('getFraudIdentityForm', () => {
    it('should call getDtoMetadata with FraudIdentityFormDto', () => {
      // When
      controller.getFraudIdentityForm(sessionServiceMock);

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudIdentityFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudIdentityForm(sessionServiceMock);

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

  describe('getFraudContactForm', () => {
    it('should call getDtoMetadata with FraudContactFormDto', () => {
      // When
      controller.getFraudContactForm(sessionServiceMock);

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(FraudContactFormDto);
    });

    it('should return metadata', () => {
      // When
      const result = controller.getFraudContactForm(sessionServiceMock);

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
    const identityMock = Symbol(
      'identityMock',
    ) as unknown as FraudIdentitySessionDto;
    const descriptionMock = Symbol(
      'descriptionMock',
    ) as unknown as FraudDescriptionSessionDto;
    const connectionMock = Symbol(
      'connectionMock',
    ) as unknown as FraudConnectionSessionDto;
    const contactMock = Symbol('contactMock') as unknown as FraudContactFormDto;
    const sessionMock = {
      description: descriptionMock,
      connection: connectionMock,
      fraudTracks: [fraudTrackMock],
      identity: identityMock,
      contact: contactMock,
    };
    const summaryMock = {
      description: descriptionMock,
      connection: connectionMock,
      fraudTracks: [sanitizeTrackMock],
      identity: identityMock,
      contact: contactMock,
    };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue(sessionMock);
      fraudIdentityTheftServiceMock.buildFraudSummary.mockReturnValueOnce(
        summaryMock,
      );
    });

    it('should get session', () => {
      // When
      controller.getFraudSummaryData(sessionServiceMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledOnce();
    });

    it('should call buildFraudSummary with session', () => {
      // When
      controller.getFraudSummaryData(sessionServiceMock);

      // Then
      expect(
        fraudIdentityTheftServiceMock.buildFraudSummary,
      ).toHaveBeenCalledExactlyOnceWith(sessionMock);
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
      fraudTracks: [fraudTrackMock],
      identity: { family_name: 'test' },
      contact: { email: 'test@test.fr' },
    };

    const fraudSummaryBodyMock = {
      consent: true,
    };

    const fraudCaseTrackingDataMock = Symbol(
      'fraudCaseTrackingDataMock',
    ) as unknown as TrackingDataDto;

    const fraudUnverifiedMessageMock = {
      type: ActionTypes.PROCESS_UNVERIFIED_IDENTITY_FRAUD_CASE,
      payload: {
        identity: identitePivotMock,
        fraudCase: {
          id: uuidMockedValue,
          ...processFraudFormBodyMock,
        },
      },
    };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue(summaryMock);
      fraudIdentityTheftServiceMock.transformToPivotIdentity.mockReturnValueOnce(
        identitePivotMock,
      );
      fraudIdentityTheftServiceMock.buildFraudCase.mockReturnValueOnce({
        ...processFraudFormBodyMock,
        id: uuidMockedValue,
      });
      csmrFraudClientMock.publishFraudCase.mockResolvedValue({
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

    it('should call csmrFraudClient.publishFraudCase', async () => {
      // When
      await controller.postFraudSummary(
        reqMock,
        resMock,
        fraudSummaryBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(
        csmrFraudClientMock.publishFraudCase,
      ).toHaveBeenCalledExactlyOnceWith(fraudUnverifiedMessageMock);
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
    const identityMock = {
      email: 'email@email.fr',
      given_name: 'givenName',
      family_name: 'familyName',
      sub: 'identityMock.sub value',
      idp_id: '8dfc4080-c90d-4234-969b-f6c961de3e90',
    };

    const { idp_id: _idpId, ...identityWithoutIdpIdMock } = identityMock;

    const fraudVerifiedMessageMock = {
      type: ActionTypes.PROCESS_VERIFIED_IDENTITY_FRAUD_CASE,
      payload: {
        identity: identityWithoutIdpIdMock,
        fraudCase: {
          id: uuidMockedValue,
          ...processFraudFormBodyMock,
        },
      },
    };

    const fraudCaseTrackingDataMock = Symbol(
      'fraudCaseTrackingDataMock',
    ) as unknown as TrackingDataDto;

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue(identityMock);
      getTransformedMock.mockReturnValueOnce(identityWithoutIdpIdMock);
      csmrFraudClientMock.publishFraudCase.mockResolvedValue({
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

    it('should call csmrFraudClient.publishFraudCase', async () => {
      // When
      await controller.processFraudForm(
        resMock,
        reqMock,
        processFraudFormBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(
        csmrFraudClientMock.publishFraudCase,
      ).toHaveBeenCalledExactlyOnceWith(fraudVerifiedMessageMock);
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
