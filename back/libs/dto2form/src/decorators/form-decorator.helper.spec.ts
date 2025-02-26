import * as ClassValidator from 'class-validator';

import { Fields } from '../enums';
import { convertRegExpToStrings } from '../helpers';
import {
  FieldAttributes,
  FieldAttributesArguments,
  FieldValidateIfRule,
  FieldValidator,
  FieldValidatorBase,
} from '../interfaces';
import { FormDecoratorHelper } from './form-decorator.helper';

jest.mock('../helpers');
jest.mock('class-validator');

describe('FormDecoratorHelper', () => {
  const key = 'testField';
  const validators: FieldValidatorBase[] = [
    { name: 'required' },
    { name: 'minLength' },
    { name: 'maxLength' },
  ];
  const expectedFinalValidators = [
    {
      name: 'required',
      errorLabel: 'required_error',
      validationArgs: [],
    },
    {
      name: 'minLength',
      errorLabel: 'minLength_error',
      validationArgs: [],
    },
    {
      name: 'maxLength',
      errorLabel: 'maxLength_error',
      validationArgs: [],
    },
  ] as [FieldValidator, ...FieldValidator[]];

  const metadataStorageMock = {
    validationMetadatas: {
      get: jest.fn(),
    },
  };

  describe('checkCompatibility', () => {
    const constructorMock = class {};

    beforeEach(() => {
      jest
        .spyOn(ClassValidator, 'getMetadataStorage')
        .mockReturnValue(
          metadataStorageMock as unknown as ClassValidator.MetadataStorage,
        );
    });

    it('should retrieve metadata from class-validator', () => {
      // When
      FormDecoratorHelper.checkCompatibility(constructorMock);

      // Then
      expect(
        metadataStorageMock.validationMetadatas.get,
      ).toHaveBeenCalledExactlyOnceWith(constructorMock);
    });

    it('should throw an error if class-validator decorators are present', () => {
      // Given
      metadataStorageMock.validationMetadatas.get.mockReturnValueOnce([]);

      // When
      const checkCompatibility = () =>
        FormDecoratorHelper.checkCompatibility(constructorMock);

      // Then
      expect(checkCompatibility).toThrow();
    });

    it('should not throw an error if class-validator decorators are not present', () => {
      // Given
      metadataStorageMock.validationMetadatas.get.mockReturnValueOnce(
        undefined,
      );

      // When
      const checkCompatibility = () =>
        FormDecoratorHelper.checkCompatibility(constructorMock);

      // Then
      expect(checkCompatibility).not.toThrow();
    });
  });

  describe('getInitialValue', () => {
    it('should return the default empty string when is not an array', () => {
      // When
      const result = FormDecoratorHelper['getInitialValue'](false);

      // Then
      expect(result).toBe('');
    });

    it('should return the default array with an single empty string when is an array', () => {
      // When
      const result = FormDecoratorHelper['getInitialValue'](true);

      // Then
      expect(result).toStrictEqual(['']);
    });

    it('should return the param value when defined', () => {
      // When
      const result = FormDecoratorHelper['getInitialValue'](false, [
        'any-mock-value',
      ]);

      // Then
      expect(result).toStrictEqual(['any-mock-value']);
    });

    it('should return the default value when param is undefined', () => {
      // When
      const result = FormDecoratorHelper['getInitialValue'](false, undefined);

      // Then
      expect(result).toStrictEqual('');
    });
  });

  describe('generateTextMissingAttributes', () => {
    const defaultOrderMock = 1;
    const defaultTypeMock = Fields.SECTION;

    it('should generate text attributes with provided values', () => {
      // Given
      const attributes = {
        order: 2,
      } as FieldAttributesArguments;
      const expectedAttributes = {
        name: key,
        type: defaultTypeMock,
        order: attributes.order,
      } as FieldAttributes;

      // When
      const result = FormDecoratorHelper.generateTextMissingAttributes(
        key,
        attributes,
        defaultOrderMock,
        defaultTypeMock,
      );

      // Then
      expect(result).toStrictEqual(expectedAttributes);
    });

    it('should generate text attributes with default values', () => {
      // Given
      const attributes = {} as FieldAttributesArguments;
      const expectedAttributes = {
        name: key,
        type: defaultTypeMock,
        order: defaultOrderMock,
      } as FieldAttributes;

      // When
      const result = FormDecoratorHelper.generateTextMissingAttributes(
        key,
        attributes,
        defaultOrderMock,
        defaultTypeMock,
      );

      // Then
      expect(result).toStrictEqual(expectedAttributes);
    });
  });

  describe('generateFieldValidatorsMissingAttributes', () => {
    const convertRegExpToStringsMock = jest.mocked(convertRegExpToStrings);

    it('should keep validationArgs if they are already defined', () => {
      // Given
      const validators: FieldValidatorBase[] = [
        { name: 'any_validator', validationArgs: ['Hello', 42] },
        { name: 'minLength', validationArgs: [5] },
        { name: 'maxLength', validationArgs: [{ foo: 'bar' }] },
      ];
      const expectedFinalValidators = [
        {
          name: 'any_validator',
          errorLabel: 'any_validator_error',
          validationArgs: ['Hello', 42],
        },
        {
          name: 'minLength',
          errorLabel: 'minLength_error',
          validationArgs: [5],
        },
        {
          name: 'maxLength',
          errorLabel: 'maxLength_error',
          validationArgs: [{ foo: 'bar' }],
        },
      ] as [FieldValidator, ...FieldValidator[]];

      convertRegExpToStringsMock
        .mockReturnValueOnce(expectedFinalValidators[0]['validationArgs'])
        .mockReturnValueOnce(expectedFinalValidators[1]['validationArgs'])
        .mockReturnValueOnce(expectedFinalValidators[2]['validationArgs']);

      // When
      const result =
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
          validators,
        );

      // Then
      expect(result).toStrictEqual(expectedFinalValidators);
    });

    it('should generate missing attributes for each validator', () => {
      // Given
      convertRegExpToStringsMock.mockReturnValue([]);

      // When
      const result =
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
          validators,
        );

      // Then
      expect(result).toStrictEqual(expectedFinalValidators);
    });

    it('should return an empty array if no validators are provided', () => {
      // Given
      const validators: FieldValidatorBase[] = [];
      convertRegExpToStringsMock.mockReturnValue([]);

      // When
      const result =
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
          validators,
        );

      // Then
      expect(result).toHaveLength(0);
    });
  });

  describe('generateFieldMissingAttributes', () => {
    const defaultOrder = 1;
    const defaultType = 'text';

    beforeEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();

      jest
        .spyOn(FormDecoratorHelper, 'generateFieldValidatorsMissingAttributes')
        .mockReturnValue(expectedFinalValidators);
    });

    it('should generate field attributes with provided values', () => {
      // Given
      const validateIfRuleMock = Symbol('validateIfRule');
      const attributes = {
        type: 'number',
        required: true,
        array: true,
        readonly: true,
        order: 2,
        validateIf: [validateIfRuleMock as unknown as FieldValidateIfRule],
        validators,
      } as FieldAttributesArguments;
      const expectedAttributes = {
        type: attributes.type,
        name: key,
        required: true,
        array: true,
        readonly: true,
        initialValue: [''],
        order: attributes.order,
        validateIf: [validateIfRuleMock as unknown as FieldValidateIfRule],
        validators: expectedFinalValidators,
      } as FieldAttributes;

      // When
      const result = FormDecoratorHelper.generateFieldMissingAttributes(
        key,
        attributes,
        defaultOrder,
        defaultType,
      );

      // Then
      expect(result).toStrictEqual(expectedAttributes);
    });

    it('should generate field attributes with default values', () => {
      // Given
      const attributes = {
        validators,
      } as FieldAttributesArguments;
      const expectedAttributes = {
        type: defaultType,
        name: key,
        initialValue: '',
        required: false,
        array: false,
        readonly: false,
        order: defaultOrder,
        validateIf: [],
        validators: expectedFinalValidators,
      } as FieldAttributes;

      // When
      const result = FormDecoratorHelper.generateFieldMissingAttributes(
        key,
        attributes,
        defaultOrder,
        defaultType,
      );

      // Then
      expect(result).toStrictEqual(expectedAttributes);
    });
  });

  describe('handleRequiredField', () => {
    it('should return attibutes received if required is not defined', () => {
      // Given
      const attributes = {
        required: false,
        validators,
      } as FieldAttributes;

      const expected = {
        required: false,
        validators: expectedFinalValidators,
      };

      const result = FormDecoratorHelper.handleRequiredField(attributes);

      // Then
      expect(result).toEqual(expected);
    });

    it('should return isFilled attribute if required key exist', () => {
      // Given
      const attributes = {
        required: true,
        validators,
      } as FieldAttributes;

      const expected = {
        required: true,
        validators: [
          {
            name: 'isFilled',
            errorLabel: `isFilled_error`,
            validationArgs: [],
          },
          ...expectedFinalValidators,
        ],
      };

      // When
      const result = FormDecoratorHelper.handleRequiredField(attributes);

      // Then
      expect(result).toEqual(expected);
    });
  });
});
