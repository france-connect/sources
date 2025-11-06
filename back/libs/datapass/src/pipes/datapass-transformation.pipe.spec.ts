import * as ClassTransformer from 'class-transformer';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import {
  DatapassWebhookPayloadDto,
  SimplifiedDatapassPayload,
} from '@fc/datapass';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import {
  DatapassTransformationException,
  DatapassValidationException,
} from '../exceptions';
import {
  DatapassTransformationPipe,
  validationOptions,
} from './datapass-transformation.pipe';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
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
        contact_technique_job_title: 'Tech Lead',
      },
    },
  };

  const mockDatapassWebhookPayloadDto: DatapassWebhookPayloadDto = {
    event: 'submit' as any,
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
        contact_technique_job_title: 'Tech Lead',
      },
    },
  };

  const expectedSimplifiedPayload: SimplifiedDatapassPayload = {
    event: 'submit' as any,
    datapassRequestId: '123',
    state: 'submitted',
    organizationName: 'Test Organization',
    applicant: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    },
    datapassName: 'Test Datapass',
    scopes: ['scope1', 'scope2'],
    technicalContact: {
      email: 'tech@example.com',
      firstname: 'Jane',
      lastname: 'Smith',
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
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
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
    let validateDtoMock;

    beforeEach(() => {
      jest
        .spyOn(ClassTransformer, 'plainToInstance')
        .mockReturnValue(mockDatapassWebhookPayloadDto);

      validateDtoMock = jest.mocked(validateDto).mockResolvedValueOnce([]);
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
      const errors = ['error1', 'error2'];
      validateDtoMock.mockReset().mockResolvedValueOnce(errors);

      // When / Then
      await expect(
        pipe['validatePayloadStructure'](mockRawPayload),
      ).rejects.toThrow(DatapassValidationException);
    });

    it('should log debug information when validation fails', async () => {
      // Given
      const errors = ['error1', 'error2'];
      validateDtoMock.mockReset().mockResolvedValueOnce(errors);

      // When
      try {
        await pipe['validatePayloadStructure'](mockRawPayload);
      } catch {}

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith({
        message: 'Datapass payload validation failed',
        validationErrors: errors,
      });
    });
  });

  describe('transformToSimplifiedPayload', () => {
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
});
