import validatorjs from 'validator';

import { ArgumentMetadata } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ArrayAsyncHelper } from '@fc/common';
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
import {
  FieldAttributes,
  FieldValidator,
  MetadataDtoInterface,
} from '../interfaces';
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
  const nameMock = 'name1';

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

      service['validateRequiredField'] = jest
        .fn()
        .mockReturnValueOnce([{ name: 'required field', errors: [] }]);
      service['hasValidatorsErrors'] = jest.fn().mockReturnValueOnce(false);
      service['removeReadonlyFields'] = jest
        .fn()
        .mockReturnValueOnce(targetMock);
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

    it('should validate if required fields are present', async () => {
      // Given
      const metadata = {
        type: 'query',
        metatype: metadatypeMock,
      } as ArgumentMetadata;

      // When
      await service.transform(targetMock, metadata);

      // Then
      expect(service['validateRequiredField']).toHaveBeenCalledTimes(1);
      expect(service['validateRequiredField']).toHaveBeenCalledWith(
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
      jest.mocked(service['validate']).mockResolvedValueOnce([
        {
          name: 'name',
          validators: [
            { name: 'name', errorMessage: 'errrors', validationArgs: [] },
          ],
        },
      ]);
      service['hasValidatorsErrors'] = jest.fn().mockReturnValueOnce(true);

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
    const metadataMock = [
      getFieldAttributesMock('name1'),
      getFieldAttributesMock('name2'),
    ];

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
    const errorMock = Symbol('some error');

    beforeEach(() => {
      service['shouldValidate'] = jest.fn().mockResolvedValue(true);
      service['handleFieldValidation'] = jest
        .fn()
        .mockResolvedValue([errorMock]);
    });

    it('should return errors with "invalidKey" if field metadata is not found', async () => {
      // Given
      const invalidKeyMock = 'epicFail';
      const metadataMock = [
        getFieldAttributesMock('name1'),
        getFieldAttributesMock('name2'),
      ];

      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        invalidKeyMock,
      );

      // Then
      expect(result).toEqual({
        name: invalidKeyMock,
        validators: [
          {
            errorMessage: `${invalidKeyMock}_invalidKey_error`,
            name: invalidKeyMock,
            validationArgs: [],
          },
        ],
      });
    });

    it('should bypass error test if field is readonly', async () => {
      // Given
      const metadataMock = [getFieldAttributesMock('name1', true, true, true)];

      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(result).toEqual({
        name: nameMock,
        validators: [],
      });
      expect(service['shouldValidate']).toHaveBeenCalledTimes(0);
      expect(service['handleFieldValidation']).toHaveBeenCalledTimes(0);
    });

    it('should check if it should validate', async () => {
      // Given
      const metadataMock = [
        getFieldAttributesMock('name1'),
        getFieldAttributesMock('name2'),
      ];

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
      const metadataMock = [
        getFieldAttributesMock('name1'),
        getFieldAttributesMock('name2'),
      ];
      service['shouldValidate'] = jest.fn().mockResolvedValueOnce(false);

      // When
      await service['validateField'](targetMock, metadataMock, nameMock);

      // Then
      expect(service['handleFieldValidation']).not.toHaveBeenCalled();
    });

    it('should return no field errors if should not validate', async () => {
      // Given
      const metadataMock = [
        getFieldAttributesMock('name1'),
        getFieldAttributesMock('name2'),
      ];
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
        validators: [],
      });
    });

    it('should call handleFieldValidation method with params', async () => {
      // Given
      const metadataMock = [
        getFieldAttributesMock('name1', true, true),
        getFieldAttributesMock('name2'),
      ];

      // When
      await service['validateField'](targetMock, metadataMock, nameMock);

      // Then
      expect(service['handleFieldValidation']).toHaveBeenCalledTimes(1);
      expect(service['handleFieldValidation']).toHaveBeenCalledWith(
        { name: nameMock, validators: [errorMock] },
        targetMock,
        metadataMock[0],
        nameMock,
      );
    });

    it('should return field errors', async () => {
      // Given
      const metadataMock = [
        getFieldAttributesMock('name1'),
        getFieldAttributesMock('name2'),
      ];

      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(result).toEqual({ name: 'name1', validators: [errorMock] });
    });

    it('should return an empty array if everything is valid', async () => {
      // Given
      const metadataMock = [
        getFieldAttributesMock('name1'),
        getFieldAttributesMock('name2'),
      ];
      service['handleFieldValidation'] = jest.fn().mockResolvedValue([]);

      // When
      const result = await service['validateField'](
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(result).toEqual({
        name: nameMock,
        validators: [],
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
        // You can't remove the catch argument, it's mandatory
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // Here "FunctionSafe" type from @fc/commons would not permit to spy on the call method as it would be considered "never" type
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      jest.spyOn(validatorjs[ValidatorJs.CONTAINS] as Function, 'call');
      const fieldValidatorMock: FieldValidator = {
        name: ValidatorJs.CONTAINS,

        validationArgs: [Symbol('arg1'), Symbol('arg2')],
        errorMessage: 'error_label',
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
        errorMessage: 'error_label',
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
        errorMessage: 'error_label',
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

  describe('hasValidatorsErrors', () => {
    it('should return false if no error found', () => {
      // Given
      const targetMock: MetadataDtoInterface[] = [
        { name: 'bar', validators: [] },
        { name: 'buzz', validators: [] },
      ];

      // When
      const result = service['hasValidatorsErrors'](targetMock);

      // Then
      expect(result).toBeFalse();
    });

    it('should return true if error found', () => {
      // Given
      const targetMock = [
        { name: 'bar', validators: [Symbol('errors')] },
        { name: 'buzz', validators: [] },
      ] as unknown as MetadataDtoInterface[];

      // When
      const result = service['hasValidatorsErrors'](targetMock);

      // Then
      expect(result).toBeTrue();
    });
  });

  describe('validateRequiredField', () => {
    it('should return no errors when all required fields are present', () => {
      const target = { field1: 'value1', field2: 'value2' };
      const metadata = [
        { name: 'field1', required: true },
        { name: 'field2', required: true },
      ] as unknown as FieldAttributes[];

      const result = service['validateRequiredField'](target, metadata);

      expect(result).toEqual([]);
    });

    it('should return errors for missing required fields', () => {
      const target = { field1: 'value1' };
      const metadata = [
        { name: 'field1', required: true },
        { name: 'field2', required: true },
      ] as unknown as FieldAttributes[];

      const result = service['validateRequiredField'](target, metadata);

      expect(result).toEqual([
        {
          name: 'field2',
          validators: [
            {
              errorMessage: 'isFilled_error',
              name: 'isFilled',
              validationArgs: [],
            },
          ],
        },
      ]);
    });

    it('should ignore non-required fields', () => {
      const target = { field1: 'value1' };
      const metadata = [
        { name: 'field1', required: true },
        { name: 'field2', required: false },
      ] as unknown as FieldAttributes[];

      const result = service['validateRequiredField'](target, metadata);

      expect(result).toEqual([]);
    });
  });

  describe('handleArrayValidation', () => {
    const errorsMapAsyncMock: FieldValidator[][] = [[], []];
    const fieldMetadataMock = { validators: [] } as unknown as FieldAttributes;

    it('should return a flat array of errors when all items in the array have errors', async () => {
      // Given
      jest
        .spyOn(ArrayAsyncHelper, 'mapAsync')
        .mockResolvedValue(errorsMapAsyncMock);

      // When
      const result = await service['handleArrayValidation'](
        targetMock,
        fieldMetadataMock,
        nameMock,
      );

      // Then
      expect(ArrayAsyncHelper.mapAsync).toHaveBeenCalledWith(
        targetMock[nameMock],
        expect.any(Function),
      );
      expect(result).toEqual(errorsMapAsyncMock.flat());
    });

    it('should return the original array of errors when not all items in the array have errors', async () => {
      // Given
      const errorsMapAsyncMock: FieldValidator[][] = [
        [],
        [{ name: 'error2', errorMessage: 'Another error', validationArgs: [] }],
      ];

      jest
        .spyOn(ArrayAsyncHelper, 'mapAsync')
        .mockResolvedValue(errorsMapAsyncMock);

      // When
      const result = await service['handleArrayValidation'](
        targetMock,
        fieldMetadataMock,
        nameMock,
      );

      // Then
      expect(result).toEqual(errorsMapAsyncMock);
    });

    it('should call handleValidation for each item in the array', async () => {
      // Given
      const target = { testField: ['value1', 'value2'] };
      const name = 'testField';

      jest
        .spyOn(ArrayAsyncHelper, 'mapAsync')
        // eslint-disable-next-line require-await
        .mockImplementation(async (array, callback) =>
          Promise.all(array.map(callback)),
        );

      service['handleValidation'] = jest.fn().mockResolvedValue([]);

      // When
      const _result = await service['handleArrayValidation'](
        target,
        fieldMetadataMock,
        name,
      );

      // Then
      expect(service['handleValidation']).toHaveBeenCalledTimes(2);
      expect(service['handleValidation']).toHaveBeenNthCalledWith(
        1,
        target,
        fieldMetadataMock,
        'value1',
      );
      expect(service['handleValidation']).toHaveBeenNthCalledWith(
        2,
        target,
        fieldMetadataMock,
        'value2',
      );
    });
  });

  describe('handleValidation', () => {
    const valueMock = 'testValue';
    const metadataMock = {
      validators: [
        { name: 'validator1', errorMessage: 'Error 1', validationArgs: [] },
      ],
    } as unknown as FieldAttributes;

    beforeEach(() => {
      service['processValidator'] = jest.fn().mockResolvedValue([]);
    });

    it('should call processValidator for the given field', async () => {
      // When
      await service['handleValidation'](targetMock, metadataMock, valueMock);

      // Then
      expect(service['processValidator']).toHaveBeenCalledTimes(1);
      expect(service['processValidator']).toHaveBeenCalledWith(
        [],
        metadataMock.validators[0],
        valueMock,
        targetMock,
      );
    });

    it('should return an empty array when all validators pass', async () => {
      // When
      const result = await service['handleValidation'](
        targetMock,
        metadataMock,
        valueMock,
      );

      // Then
      expect(result).toEqual([]);
    });

    it('should return errors for validators that fail', async () => {
      // Given
      service['processValidator'] = jest
        .fn()
        .mockResolvedValueOnce([
          { name: 'validator1', errorMessage: 'Error 1', validationArgs: [] },
        ]);

      // When
      const result = await service['handleValidation'](
        targetMock,
        metadataMock,
        valueMock,
      );

      // Then
      expect(result).toEqual([
        { name: 'validator1', errorMessage: 'Error 1', validationArgs: [] },
      ]);
    });
  });

  describe('processValidator', () => {
    const valueMock = Symbol('value') as unknown as string;
    const errorsMock = Symbol('error') as unknown as FieldValidator[];
    const validatorMock = Symbol('validator') as unknown as FieldValidator;

    it('should call callValidator', async () => {
      // Given
      service['callValidator'] = jest.fn().mockResolvedValue(true);

      // When
      const _result = await service['processValidator'](
        errorsMock,
        validatorMock,
        valueMock,
        targetMock,
      );

      // Then
      expect(service['callValidator']).toHaveBeenCalledTimes(1);
      expect(service['callValidator']).toHaveBeenCalledWith(
        validatorMock,
        valueMock,
        targetMock,
      );
    });

    it('should add an error to the errors array if validation fails', async () => {
      // Given
      const errorsMock: FieldValidator[] = [];
      const validatorMock: FieldValidator = {
        name: 'testValidator',
        errorMessage: 'Invalid value',
        validationArgs: [{ minLength: 3 }],
      };

      service['callValidator'] = jest.fn().mockResolvedValue(false);

      // When
      const result = await service['processValidator'](
        errorsMock,
        validatorMock,
        valueMock,
        targetMock,
      );

      // Then
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        name: 'testValidator',
        errorMessage: 'Invalid value',
        validationArgs: [{ minLength: 3 }],
      });
    });

    it('should return the existing errors array if callValidator return true', async () => {
      // Given
      const errorsMock: FieldValidator[] = [
        {
          name: 'existingValidator',
          errorMessage: 'Existing error',
          validationArgs: [],
        },
      ];

      service['callValidator'] = jest.fn().mockResolvedValue(true);

      // When
      const result = await service['processValidator'](
        errorsMock,
        validatorMock,
        valueMock,
        targetMock,
      );

      // Then
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(errorsMock[0]);
    });
  });

  describe('handleFieldValidation', () => {
    const fieldErrorMock = {
      name: nameMock,
      validators: [],
    };
    const validatorMock = [
      { name: 'validator1', errorMessage: 'Error 1', validationArgs: [] },
    ];

    beforeEach(() => {
      service['handleArrayValidation'] = jest
        .fn()
        .mockResolvedValueOnce(validatorMock);
      service['handleValidation'] = jest
        .fn()
        .mockResolvedValueOnce(validatorMock);
    });

    it('should call handleArrayValidation if field is an array', async () => {
      // Given
      const metadataMock = getFieldAttributesMock('name1', true, true);

      // When
      const result = await service['handleFieldValidation'](
        fieldErrorMock,
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(service['handleValidation']).toHaveBeenCalledTimes(0);
      expect(service['handleArrayValidation']).toHaveBeenCalledTimes(1);
      expect(service['handleArrayValidation']).toHaveBeenCalledWith(
        targetMock,
        metadataMock,
        nameMock,
      );
      expect(result).toEqual(validatorMock);
    });

    it('should call handleValidation if field is not an array', async () => {
      // Given
      const metadataMock = getFieldAttributesMock('name1');

      // When
      const result = await service['handleFieldValidation'](
        fieldErrorMock,
        targetMock,
        metadataMock,
        nameMock,
      );

      // Then
      expect(service['handleArrayValidation']).toHaveBeenCalledTimes(0);
      expect(service['handleValidation']).toHaveBeenCalledTimes(1);
      expect(service['handleValidation']).toHaveBeenCalledWith(
        targetMock,
        metadataMock,
        targetMock[nameMock],
      );
      expect(result).toEqual(validatorMock);
    });
  });

  describe('removeReadonlyFields', () => {
    it('should return only metadata with readonly at false', () => {
      // Given
      const metadataMock = [
        getFieldAttributesMock('name1', true, true, true),
        getFieldAttributesMock('name2'),
      ];
      const targetMock = {
        name1: 'name1',
        name2: 'name2',
      };

      // When
      const result = service['removeReadonlyFields'](targetMock, metadataMock);

      // Then
      expect(result).toEqual({ name2: 'name2' });
    });
  });
});
