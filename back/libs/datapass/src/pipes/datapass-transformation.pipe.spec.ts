import * as ClassTransformer from 'class-transformer';
import { ValidationError } from 'class-validator';

import { Test, TestingModule } from '@nestjs/testing';

import { getAllPropertiesErrors, validateDto } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { DatapassWebhookPayloadDto } from '../dto';
import {
  DatapassAuthorizationRequestClass,
  DatapassAuthorizationState,
  DatapassEidasLevels,
  DatapassEvents,
  DatapassScopes,
} from '../enums';
import {
  DatapassEidasLevelException,
  DatapassNoActiveAuthorizationException,
  DatapassTransformationException,
  DatapassValidationException,
} from '../exceptions';
import { SimplifiedDatapassPayload } from '../interfaces';
import {
  DatapassTransformationPipe,
  validationOptions,
} from './datapass-transformation.pipe';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
  getAllPropertiesErrors: jest.fn(),
}));

describe('DatapassTransformationPipe', () => {
  let pipe: DatapassTransformationPipe;

  const loggerMock = getLoggerMock();

  const mockRawPayload = {
    event: 'submit',
    fired_at: 1640995200,
    model_type: 'Pass',
    data: {
      id: 123,
      public_id: '12345',
      state: 'submitted',
      form_uid: 'test-form-uid',
      organization: {
        id: 456,
        name: 'Test Organization',
        siret: '12345678901234',
      },
      applicant: {
        id: 789,
        email: 'test@example.com',
        given_name: 'John',
        family_name: 'Doe',
        phone_number: '+33123456789',
        job_title: 'Developer',
      },
      data: {
        intitule: 'Test Datapass',
        scopes: ['scope1', 'scope2'],
        contact_technique_email: 'tech@example.com',

        contact_technique_given_name: 'Jane',
        contact_technique_family_name: 'Smith',
        contact_technique_phone_number: '+33987654321',
      },
    },
  };

  const mockDatapassWebhookPayloadDto: DatapassWebhookPayloadDto = {
    event: 'submit' as any,
    fired_at: 1640995200,
    model_type: 'Pass',
    last_validated_at: '2024-01-15T10:00:00Z',
    data: {
      id: 123,
      authorizations: [
        {
          id: '456',
          state: DatapassAuthorizationState.OBSOLETE,
          authorization_request_class:
            DatapassAuthorizationRequestClass.FRANCE_CONNECT,
          revoked: false,
        },
        {
          id: '789',
          state: DatapassAuthorizationState.OBSOLETE,
          authorization_request_class:
            DatapassAuthorizationRequestClass.FRANCE_CONNECT,
          revoked: true,
        },
        {
          id: '101',
          state: DatapassAuthorizationState.ACTIVE,
          authorization_request_class:
            DatapassAuthorizationRequestClass.FRANCE_CONNECT,
          revoked: false,
        },
      ],
      public_id: '12345',
      state: 'submitted',
      form_uid: 'test-form-uid',
      organization: {
        id: 456,
        name: 'Test Organization',
        siret: '12345678901234',
      },
      applicant: {
        email: 'Test@Example.COM',
        given_name: 'John',
        family_name: 'Doe',
        phone_number: '+33123456789',
      },
      data: {
        france_connect_eidas: DatapassEidasLevels.EIDAS_1,
        intitule: 'Test Datapass',
        scopes: [DatapassScopes.EMAIL, DatapassScopes.GIVEN_NAME],
        contact_technique_email: 'tech@example.com',

        contact_technique_given_name: 'Jane',
        contact_technique_family_name: 'Smith',
        contact_technique_phone_number: '+33987654321',
      },
    },
  };

  const expectedSimplifiedPayload: SimplifiedDatapassPayload = {
    event: DatapassEvents.SUBMIT,
    datapassRequestId: '123',
    datapassAuthorizationId: '456',
    datapassEidasLevel: DatapassEidasLevels.EIDAS_1,
    state: 'submitted',
    organization: {
      id: 456,
      name: 'Test Organization',
      siret: '12345678901234',
    },
    applicant: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phone: '+33123456789',
    },
    datapassName: 'Test Datapass',
    scopes: [DatapassScopes.EMAIL, DatapassScopes.GIVEN_NAME],
    technicalContact: {
      email: 'tech@example.com',
      firstname: 'Jane',
      lastname: 'Smith',
      phone: '+33987654321',
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatapassTransformationPipe, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    pipe = module.get<DatapassTransformationPipe>(DatapassTransformationPipe);
  });

  describe('validationOptions', () => {
    it('should have correct validation options', () => {
      expect(validationOptions).toEqual({
        forbidNonWhitelisted: false,
        forbidUnknownValues: false,
        skipMissingProperties: false,
        whitelist: true,
      });
    });
  });

  describe('transform', () => {
    beforeEach(() => {
      pipe['validatePayloadStructure'] = jest
        .fn()
        .mockResolvedValueOnce(mockDatapassWebhookPayloadDto);
      pipe['transformToSimplifiedPayload'] = jest
        .fn()
        .mockReturnValueOnce(expectedSimplifiedPayload);
    });

    it('should return null when called with a test payload', async () => {
      // Given
      const testPayload = { test: true };

      // When
      const result = await pipe.transform(testPayload);

      // Then
      expect(result).toBeNull();
    });

    it('should log debug information when method is called', async () => {
      // When
      await pipe.transform(mockRawPayload);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        'Starting Datapass webhook validation and transformation',
      );
    });

    it('should call validatePayloadStructure with raw payload', async () => {
      // When
      await pipe.transform(mockRawPayload);

      // Then
      expect(pipe['validatePayloadStructure']).toHaveBeenCalledExactlyOnceWith(
        mockRawPayload,
      );
    });

    it('should call transformToSimplifiedPayload with validated dto', async () => {
      // When
      await pipe.transform(mockRawPayload);

      // Then
      expect(
        pipe['transformToSimplifiedPayload'],
      ).toHaveBeenCalledExactlyOnceWith(mockDatapassWebhookPayloadDto);
    });

    it('should log successfully debug transform valid payload', async () => {
      // When
      await pipe.transform(mockRawPayload);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith({
        message: 'Datapass payload validation successful',
        datapassRequestId: expectedSimplifiedPayload.datapassRequestId,
      });
    });

    it('should return simplified payload when input is valid', async () => {
      // When
      const result = await pipe.transform(mockRawPayload);

      // Then
      expect(result).toEqual(expectedSimplifiedPayload);
    });
  });

  describe('validatePayloadStructure', () => {
    const validateDtoMock = jest.mocked(validateDto);

    beforeEach(() => {
      jest
        .spyOn(ClassTransformer, 'plainToInstance')
        .mockReturnValue(mockDatapassWebhookPayloadDto);

      validateDtoMock.mockResolvedValueOnce([]);
    });

    it('should call plainToInstance with correct parameters', async () => {
      // When
      await pipe['validatePayloadStructure'](mockRawPayload);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledExactlyOnceWith(
        DatapassWebhookPayloadDto,
        mockRawPayload,
        { enableImplicitConversion: true },
      );
    });

    it('should call validateDto with correct parameters', async () => {
      // When
      await pipe['validatePayloadStructure'](mockRawPayload);

      // Then
      expect(validateDtoMock).toHaveBeenCalledExactlyOnceWith(
        mockDatapassWebhookPayloadDto,
        DatapassWebhookPayloadDto,
        validationOptions,
      );
    });

    it('should return dto when validation passes', async () => {
      // When
      const result = await pipe['validatePayloadStructure'](mockRawPayload);

      // Then
      expect(result).toBe(mockDatapassWebhookPayloadDto);
    });

    it('should throw an error when validation fails', async () => {
      // Given
      const errors: ValidationError[] = [
        {
          property: 'event',
          constraints: {
            isEnum: 'event must be a valid enum value',
          },
          children: [],
        },
      ];
      pipe['checkEidasLevel'] = jest.fn();
      validateDtoMock.mockReset().mockResolvedValueOnce(errors);

      // When / Then
      await expect(
        pipe['validatePayloadStructure'](mockRawPayload),
      ).rejects.toThrow(DatapassValidationException);
    });
  });

  describe('checkEidasLevel', () => {
    const errors: ValidationError[] = [];

    it('should throw DatapassEidasLevelException when eidas level is invalid', () => {
      // Given
      jest
        .mocked(getAllPropertiesErrors)
        .mockReturnValueOnce(['data.data.france_connect_eidas: isIn']);

      // When / Then
      expect(() => pipe['checkEidasLevel'](errors)).toThrow(
        DatapassEidasLevelException,
      );
    });

    it('should not throw DatapassEidasLevelException when eidas level is valid', () => {
      // Given
      jest
        .mocked(getAllPropertiesErrors)
        .mockReturnValueOnce(['data.data.some_other_field']);

      // When / Then
      expect(() => pipe['checkEidasLevel'](errors)).not.toThrow();
    });

    it('should not throw DatapassEidasLevelException when there are no errors', () => {
      // Given
      jest.mocked(getAllPropertiesErrors).mockReturnValueOnce([]);

      // When / Then
      expect(() => pipe['checkEidasLevel'](errors)).not.toThrow();
    });
  });

  describe('transformToSimplifiedPayload', () => {
    beforeEach(() => {
      pipe['getCurrentAuthorization'] = jest.fn().mockReturnValueOnce({
        id: '456',
        state: 'validated',
        authorization_request_class: 'AuthorizationRequest::FranceConnect',
        revoked: false,
      });
    });
    it('should transform DatapassWebhookPayloadDto to SimplifiedDatapassPayload correctly', () => {
      // When
      const result = pipe['transformToSimplifiedPayload'](
        mockDatapassWebhookPayloadDto,
      );

      // Then
      expect(result).toEqual(expectedSimplifiedPayload);
    });

    it('should throw DatapassTransformationException when transformation fails', () => {
      // Given
      const invalidPayload = {
        ...mockDatapassWebhookPayloadDto,
        data: null,
      } as any;

      // When / Then
      expect(() =>
        pipe['transformToSimplifiedPayload'](invalidPayload),
      ).toThrow(DatapassTransformationException);
    });
  });

  describe('getCurrentAuthorization', () => {
    it('should return the current authorization', () => {
      // When
      const result = pipe['getCurrentAuthorization'](
        mockDatapassWebhookPayloadDto,
      );

      // Then
      expect(result).toBe(mockDatapassWebhookPayloadDto.data.authorizations[2]);
    });

    it('should throw DatapassNoActiveAuthorizationException when no active authorization is found', () => {
      // Given
      const noActiveAuthorizationPayload = {
        ...mockDatapassWebhookPayloadDto,
        data: {
          ...mockDatapassWebhookPayloadDto.data,
          authorizations: [
            ...mockDatapassWebhookPayloadDto.data.authorizations.slice(0, 2),
          ],
        },
      };

      // When / Then
      expect(() =>
        pipe['getCurrentAuthorization'](noActiveAuthorizationPayload),
      ).toThrow(DatapassNoActiveAuthorizationException);
    });
  });
});
