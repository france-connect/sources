import * as ClassValidator from 'class-validator';

import {
  FieldAttributes,
  FieldAttributesArguments,
  FieldValidateIfRule,
  FieldValidator,
  FieldValidatorBase,
} from '../interfaces';
import { FormDecoratorHelper } from './form-decorator.helper';

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
      errorLabel: 'testField_required_error',
      validationArgs: [],
    },
    {
      name: 'minLength',
      errorLabel: 'testField_minLength_error',
      validationArgs: [],
    },
    {
      name: 'maxLength',
      errorLabel: 'testField_maxLength_error',
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

  describe('generateFieldValidatorsMissingAttributes', () => {
    it('should keep validationArgs if they are already defined', () => {
      // Given
      const validators: FieldValidatorBase[] = [
        { name: 'required', validationArgs: ['Hello', 42] },
        { name: 'minLength', validationArgs: [5] },
        { name: 'maxLength', validationArgs: [{ foo: 'bar' }] },
      ];
      const expectedFinalValidators = [
        {
          name: 'required',
          errorLabel: 'testField_required_error',
          validationArgs: ['Hello', 42],
        },
        {
          name: 'minLength',
          errorLabel: 'testField_minLength_error',
          validationArgs: [5],
        },
        {
          name: 'maxLength',
          errorLabel: 'testField_maxLength_error',
          validationArgs: [{ foo: 'bar' }],
        },
      ] as [FieldValidator, ...FieldValidator[]];

      // When
      const result =
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
          key,
          validators,
        );

      // Then
      expect(result).toStrictEqual(expectedFinalValidators);
    });

    it('should generate missing attributes for each validator', () => {
      // When
      const result =
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
          key,
          validators,
        );

      // Then
      expect(result).toStrictEqual(expectedFinalValidators);
    });

    it('should return an empty array if no validators are provided', () => {
      // Given
      const validators: FieldValidatorBase[] = [];

      // When
      const result =
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes(
          key,
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
        order: 2,
        validateIf: [validateIfRuleMock as unknown as FieldValidateIfRule],
        validators,
      } as FieldAttributesArguments;
      const expectedAttributes = {
        type: attributes.type,
        name: key,
        label: `${key}_label`,
        required: true,
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
        label: `${key}_label`,
        required: false,
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
});
