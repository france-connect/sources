import validatorjs from 'validator';

import { ArgumentMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import {
  getFieldAttributesMock,
  getValidateIfMock,
  getValidateIfRulesServiceMock,
  getValidatorCustomServiceMock,
} from '@mocks/dto2form';
import { getLoggerMock } from '@mocks/logger';

import { FormDtoBase } from '../dto';
import { ValidatorJs } from '../enums';
import {
  Dto2FormInvalidFormException,
  Dto2FormValidateIfRuleNotFoundException,
  Dto2FormValidationErrorException,
} from '../exceptions';
import { FieldAttributes, FieldValidator } from '../interfaces';
import { ValidateIfRulesService, ValidatorCustomService } from '../services';
import { FORM_METADATA_TOKEN } from '../tokens';
import { FormValidationPipe } from './form-validation.pipe';

jest.mock('validator');

describe('FormValidationPipe', () => {
  let service: FormValidationPipe;

  const loggerMock = getLoggerMock();
  const validatorCustomMock = getValidatorCustomServiceMock();
  const validateIfRulesMock = getValidateIfRulesServiceMock();

  const targetMock = Symbol('target') as unknown as Record<string, unknown>;
  const metadataMock = [
    getFieldAttributesMock('name1'),
    getFieldAttributesMock('name2'),
  ] as FieldAttributes[];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormValidationPipe,
        LoggerService,
        ValidatorCustomService,
        ValidateIfRulesService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ValidatorCustomService)
      .useValue(validatorCustomMock)
      .overrideProvider(ValidateIfRulesService)
      .useValue(validateIfRulesMock)
      .compile();

    service = module.get<FormValidationPipe>(FormValidationPipe);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transform', () => {
    const targetMock = Symbol('target') as unknown as Record<string, unknown>;
    class FormDtoMock extends FormDtoBase {}
    const metadatypeMock = FormDtoMock;
    const metadataMock = [Symbol('metadata')] as unknown as Record<
      string,
      unknown
    >[];

    beforeEach(() => {
      service['validate'] = jest.fn().mockResolvedValue([]);
      Reflect.defineMetadata(FORM_METADATA_TOKEN, metadataMock, metadatypeMock);
    });

    it('should not validate if type is not body or query', async () => {
      // Given
      const metadata = { type: 'param' } as ArgumentMetadata;

      // When
      await service.transform(targetMock, metadata);

      // Then
      expect(service['validate']).not.toHaveBeenCalled();
    });

    it('should return target if type is not body or query', async () => {
      // Given
      const metadata = { type: 'param' } as ArgumentMetadata;

      // When
      const result = await service.transform(targetMock, metadata);

      // Then
      expect(result).toBe(targetMock);
    });

    it('should not validate if data is present', async () => {
      // Given
      const metadata = { type: 'body', data: 'data' } as ArgumentMetadata;

      // When
      await service.transform(targetMock, metadata);

      // Then
      expect(service['validate']).toHaveBeenCalledTimes(0);
    });

    it('should return target if data is present', async () => {
      // Given
      const metadata = { type: 'body', data: 'data' } as ArgumentMetadata;

      // When
      const result = await service.transform(targetMock, metadata);

      // Then
      expect(result).toBe(targetMock);
    });

    it('should throw an error if metatype is not an instance of FormDtoBase', async () => {
      // Given
      const metadata = { type: 'body', metatype: {} } as ArgumentMetadata;

      // When / Then
      await expect(service.transform(targetMock, metadata)).rejects.toThrow(
        Dto2FormInvalidFormException,
      );
    });

    it('should retrieve metadata', async () => {
      // Given
      const metadata = {
        type: 'body',
        metatype: metadatypeMock,
      } as ArgumentMetadata;
      const getMetadataSpy = jest.spyOn(Reflect, 'getMetadata');

      // When
      await service.transform(targetMock, metadata);

      // Then
      expect(getMetadataSpy).toHaveBeenCalledWith(
        FORM_METADATA_TOKEN,
        metadatypeMock,
      );
    });

    it('should validate target', async () => {
      // Given
      const metadata = {
        type: 'query',
        metatype: metadatypeMock,
      } as ArgumentMetadata;

      // When
      await service.transform(targetMock, metadata);

      // Then
      expect(service['validate']).toHaveBeenCalledWith(
        targetMock,
        metadataMock,
      );
    });

    it('should throw an error if the validation ends up with errors', async () => {
      // Given
      const metadata = {
        type: 'query',
        metatype: metadatypeMock,
      } as ArgumentMetadata;
      jest
        .mocked(service['validate'])
        .mockResolvedValueOnce([{ name: 'name', errors: ['error'] }]);

      // When / Then
      await expect(service.transform(targetMock, metadata)).rejects.toThrow(
        Dto2FormValidationErrorException,
      );
    });

    it('should return target', async () => {
      // Given
      const metadata = {
        type: 'body',
        metatype: metadatypeMock,
      } as ArgumentMetadata;

      // When
      const result = await service.transform(targetMock, metadata);

      // Then
      expect(result).toBe(targetMock);
    });
  });

  describe('validate', () => {
    const keysMock = ['name1', 'name2'];

    beforeEach(() => {
      service['getAttributeKeys'] = jest.fn().mockReturnValue(keysMock);
      service['validateField'] = jest.fn();
    });

    it('should call retrieve attributes keys', async () => {
      // When
      await service['validate'](targetMock, metadataMock);

      // Then
      expect(service['getAttributeKeys']).toHaveBeenCalledWith(targetMock);
    });

    it('should call validateField for each field', async () => {
      // When
      await service['validate'](targetMock, metadataMock);

      // Then
      expect(service['validateField']).toHaveBeenCalledTimes(2);
      expect(service['validateField']).toHaveBeenNthCalledWith(
        1,
        targetMock,
        metadataMock,
        keysMock[0],
        0,
        keysMock,
      );
      expect(service['validateField']).toHaveBeenNthCalledWith(
        2,
        targetMock,
        metadataMock,
        keysMock[1],
        1,
        keysMock,
      );
    });
  });

  describe('validateField', () => {
    const nameMock = 'name1';

    beforeEach(() => {
      service['shouldValidate'] = jest.fn().mockResolvedValue(true);
      service['callValidator'] = jest.fn().mockResolvedValue(true);
    });

    it('should return errors with "invalidKey" if field metadata is not found', async () => {
      const invalidKeyMock = 'epicFail';

      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        invalidKeyMock,
      );

      // Then
      expect(result).toEqual({
        name: invalidKeyMock,
        errors: [`${invalidKeyMock}_invalidKey_error`],
      });
    });

    it('should check if it should validate', async () => {
      // When
      await service['validateField'](targetMock, metadataMock, nameMock);

      // Then
      expect(service['shouldValidate']).toHaveBeenCalledWith(
        targetMock[nameMock],
        targetMock,
        metadataMock[0].validateIf,
      );
    });

    it('should not validate if "shouldValidate" returns "false"', async () => {
      // Given
      service['shouldValidate'] = jest.fn().mockResolvedValueOnce(false);

      // When
      await service['validateField'](targetMock, metadataMock, nameMock);

      // Then
      expect(service['callValidator']).not.toHaveBeenCalled();
    });

    it('should return no field errors if should not validate', async () => {
      // Given
      service['shouldValidate'] = jest.fn().mockResolvedValueOnce(false);

      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(result).toEqual({
        name: nameMock,
        errors: [],
      });
    });

    it('should call each validator for the field', async () => {
      // When
      await service['validateField'](targetMock, metadataMock, nameMock);

      // Then
      expect(service['callValidator']).toHaveBeenCalledTimes(2);
      expect(service['callValidator']).toHaveBeenNthCalledWith(
        1,
        metadataMock[0].validators[0],
        targetMock[nameMock],
        targetMock,
      );
      expect(service['callValidator']).toHaveBeenNthCalledWith(
        2,
        metadataMock[0].validators[1],
        targetMock[nameMock],
        targetMock,
      );
    });

    it('should return field errors', async () => {
      // Given
      service['callValidator'] = jest.fn().mockResolvedValueOnce(false);

      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(result).toEqual({
        name: nameMock,
        errors: [
          metadataMock[0].validators[0].errorLabel,
          metadataMock[0].validators[1].errorLabel,
        ],
      });
    });

    it('should return an empty array if everything is valid', async () => {
      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(result).toEqual({
        name: nameMock,
        errors: [],
      });
    });
  });

  describe('shouldValidate', () => {
    const valueMock = 'value';
    const targetMock = { name: valueMock };
    const validateIfMock = [
      getValidateIfMock('name1'),
      getValidateIfMock('name2'),
    ];

    beforeEach(() => {
      service['callValidateIfRule'] = jest.fn().mockResolvedValue(true);
    });

    it('should return true if validateIf is not an Array', async () => {
      // When
      const result = await service['shouldValidate'](
        valueMock,
        targetMock,
        null,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return true if there is no validateIf rule', async () => {
      // When
      const result = await service['shouldValidate'](valueMock, targetMock, []);

      // Then
      expect(result).toBe(true);
    });

    it('should return true if all validateIf rules are met', async () => {
      // When
      const result = await service['shouldValidate'](
        valueMock,
        targetMock,
        validateIfMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if one validateIf rule is not met', async () => {
      // Given
      jest.mocked(service['callValidateIfRule']).mockResolvedValueOnce(false);

      // When
      const result = await service['shouldValidate'](
        valueMock,
        targetMock,
        validateIfMock,
      );

      // Then
      expect(result).toBe(false);
    });
  });

  describe('callValidateIfRule', () => {
    const valueMock = 'valueMock';
    const targetMock = { field: valueMock };
    const ruleMock = getValidateIfMock('validateIfRule1');

    beforeEach(() => {
      validateIfRulesMock[ruleMock.name].mockResolvedValue(true);
    });

    it('should call the conditional validation handler', async () => {
      // Given
      jest.spyOn(validateIfRulesMock[ruleMock.name], 'call');

      // When
      await service['callValidateIfRule'](ruleMock, valueMock, targetMock);

      // Then
      expect(
        validateIfRulesMock[ruleMock.name].call,
      ).toHaveBeenCalledExactlyOnceWith(
        validateIfRulesMock,
        valueMock,
        ...ruleMock.ruleArgs,
        { target: targetMock },
      );
    });

    it('should call the conditional validation handler without error if there is no rule arg', async () => {
      // Given
      const ruleMockNoArg = getValidateIfMock('validateIfRule2');
      delete ruleMockNoArg.ruleArgs;

      jest.spyOn(validateIfRulesMock[ruleMockNoArg.name], 'call');

      // When
      await service['callValidateIfRule'](ruleMockNoArg, valueMock, targetMock);

      // Then
      expect(
        validateIfRulesMock[ruleMockNoArg.name].call,
      ).toHaveBeenCalledExactlyOnceWith(validateIfRulesMock, valueMock, {
        target: targetMock,
      });
    });

    it('should return the validator result', async () => {
      // When
      const result = await service['callValidateIfRule'](
        ruleMock,
        valueMock,
        targetMock,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should throw a Dto2FormValidateIfRuleNotFoundException error if the rule is not found', async () => {
      // Given
      const invalidRuleMock = getValidateIfMock('invalidRule');

      // When / Then
      await expect(
        service['callValidateIfRule'](invalidRuleMock, valueMock, targetMock),
      ).rejects.toThrow(Dto2FormValidateIfRuleNotFoundException);
    });

    it('should log a critical error if the rule is not found', async () => {
      // Given
      const invalidRuleMock = getValidateIfMock('invalidRule');

      // When
      try {
        await service['callValidateIfRule'](
          invalidRuleMock,
          valueMock,
          targetMock,
        );
      } catch (error) {}

      expect(loggerMock.crit).toHaveBeenCalledWith(
        `Conditional validation rule not found: ${invalidRuleMock.name}`,
      );
    });
  });

  describe('callValidator', () => {
    it('should call the validation rule with validator service, value and validation args', async () => {
      // Given
      const valueMock = Symbol('value');
      jest.spyOn(validatorjs[ValidatorJs.CONTAINS] as Function, 'call');
      const fieldValidatorMock: FieldValidator = {
        name: ValidatorJs.CONTAINS,

        validationArgs: [Symbol('arg1'), Symbol('arg2')],
        errorLabel: 'error_label',
      };

      // When
      await service['callValidator'](fieldValidatorMock, valueMock, targetMock);

      // Then
      expect(
        validatorjs[ValidatorJs.CONTAINS].call,
      ).toHaveBeenCalledExactlyOnceWith(
        validatorjs,
        valueMock,
        ...fieldValidatorMock.validationArgs,
      );
    });

    it('should call the custom validation rule with custom validator service, value, validation args and the custom context', async () => {
      // Given
      const valueMock = Symbol('value');
      jest.spyOn(validatorCustomMock.validator1, 'call');
      const fieldValidatorMock: FieldValidator = {
        name: 'validator1',

        validationArgs: [Symbol('arg1'), Symbol('arg2')],
        errorLabel: 'error_label',
      };

      // When
      await service['callValidator'](fieldValidatorMock, valueMock, targetMock);

      // Then
      expect(
        validatorCustomMock.validator1.call,
      ).toHaveBeenCalledExactlyOnceWith(
        validatorCustomMock,
        valueMock,
        ...fieldValidatorMock.validationArgs,
        {
          target: targetMock,
        },
      );
    });

    it('should return the validation result', async () => {
      // Given
      const valueMock = Symbol('value');
      const expectedResult = Symbol('true') as unknown as boolean;
      jest
        .mocked(validatorjs[ValidatorJs.CONTAINS])
        .mockReturnValue(expectedResult);

      const fieldValidatorMock: FieldValidator = {
        name: ValidatorJs.CONTAINS,

        validationArgs: [],
        errorLabel: 'error_label',
      };

      // When
      const result = await service['callValidator'](
        fieldValidatorMock,
        valueMock,
        targetMock,
      );

      // Then
      expect(result).toBe(expectedResult);
    });
  });

  describe('getAttributeKeys', () => {
    it('should return the keys of the target object that are not functions', () => {
      // Given
      const targetMock = {
        key1: 'value1',
        wrong: () => {},
        key2: 'value2',
      };

      // When
      const result = service['getAttributeKeys'](targetMock);

      // Then
      expect(result).toEqual(['key1', 'key2']);
    });
  });
});
