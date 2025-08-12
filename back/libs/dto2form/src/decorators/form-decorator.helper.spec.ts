import * as ClassValidator from 'class-validator';

import { Fields, MessageLevelEnum, MessagePriorityEnum } from '../enums';
import { convertRegExpToStrings } from '../helpers';
import {
  ChoiceAttributes,
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

  const requiredErrorMessage = {
    content: 'required_error',
    level: MessageLevelEnum.ERROR,
    priority: MessagePriorityEnum.ERROR,
  };

  const minLengthErrorMessage = {
    content: 'minLength_error',
    level: MessageLevelEnum.ERROR,
    priority: MessagePriorityEnum.ERROR,
  };

  const maxLengthErrorMessage = {
    content: 'maxLength_error',
    level: MessageLevelEnum.ERROR,
    priority: MessagePriorityEnum.ERROR,
  };

  const expectedFinalValidators = [
    {
      name: 'required',
      errorMessage: requiredErrorMessage,
      validationArgs: [],
    },
    {
      name: 'minLength',
      errorMessage: minLengthErrorMessage,
      validationArgs: [],
    },
    {
      name: 'maxLength',
      errorMessage: maxLengthErrorMessage,
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

      const anyValidatorErrorMessage = {
        content: 'any_validator_error',
        level: MessageLevelEnum.ERROR,
        priority: MessagePriorityEnum.ERROR,
      };

      const expectedFinalValidators = [
        {
          name: 'any_validator',
          errorMessage: anyValidatorErrorMessage,
          validationArgs: ['Hello', 42],
        },
        {
          name: 'minLength',
          errorMessage: minLengthErrorMessage,
          validationArgs: [5],
        },
        {
          name: 'maxLength',
          errorMessage: maxLengthErrorMessage,
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

  describe('getDefaultAttributes', () => {
    const defaultValue = Symbol('defaultValue') as unknown as string;

    it('should return the value of the key if it is defined', () => {
      // Given
      const keyMock = 'key';
      const attributesMock = {
        [keyMock]: Symbol('testValue'),
      } as unknown as FieldAttributesArguments;

      // When
      const result = FormDecoratorHelper.getDefaultAttributes<string>(
        keyMock,
        attributesMock,
        defaultValue,
      );

      // Then
      expect(result).toBe(attributesMock[keyMock]);
    });

    it('should return the default value if the key is not defined', () => {
      // Given
      const keyMock = 'key';
      const attributesMock = {} as FieldAttributesArguments;

      // When
      const result = FormDecoratorHelper.getDefaultAttributes<string>(
        keyMock,
        attributesMock,
        defaultValue,
      );

      // Then
      expect(result).toBe(defaultValue);
    });
  });

  describe('generateFieldMissingAttributes', () => {
    const defaultOrder = 1;
    const defaultType = 'text';
    const defaultValidateIf = [];

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
        type: 'radio',
        required: true,
        array: true,
        readonly: true,
        order: 2,
        initialValue: [''],
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

      jest
        .spyOn(FormDecoratorHelper, 'getDefaultAttributes')
        .mockReturnValueOnce(attributes.type)
        .mockReturnValueOnce(attributes.order)
        .mockReturnValueOnce(attributes.validateIf);

      FormDecoratorHelper['getInitialValue'] = jest.fn().mockReturnValue(['']);

      // When
      const result = FormDecoratorHelper.generateFieldMissingAttributes(
        key,
        attributes,
        defaultOrder,
        defaultType,
      );

      // Then
      expect(result).toStrictEqual(expectedAttributes);

      expect(
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes,
      ).toHaveBeenCalledTimes(1);
      expect(
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes,
      ).toHaveBeenCalledWith(attributes.validators);

      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenCalledTimes(3);
      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenNthCalledWith(
        1,
        'type',
        attributes,
        defaultType,
      );
      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenNthCalledWith(
        2,
        'order',
        attributes,
        defaultOrder,
      );
      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenNthCalledWith(
        3,
        'validateIf',
        attributes,
        defaultValidateIf,
      );

      expect(FormDecoratorHelper['getInitialValue']).toHaveBeenCalledTimes(1);
      expect(FormDecoratorHelper['getInitialValue']).toHaveBeenCalledWith(
        attributes.array,
        attributes.initialValue,
      );
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

      jest
        .spyOn(FormDecoratorHelper, 'getDefaultAttributes')
        .mockReturnValueOnce(defaultType)
        .mockReturnValueOnce(defaultOrder)
        .mockReturnValueOnce(defaultValidateIf);

      FormDecoratorHelper['getInitialValue'] = jest.fn().mockReturnValue('');

      // When
      const result = FormDecoratorHelper.generateFieldMissingAttributes(
        key,
        attributes,
        defaultOrder,
        defaultType,
      );

      // Then
      expect(result).toStrictEqual(expectedAttributes);

      expect(
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes,
      ).toHaveBeenCalledTimes(1);
      expect(
        FormDecoratorHelper.generateFieldValidatorsMissingAttributes,
      ).toHaveBeenCalledWith(attributes.validators);

      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenCalledTimes(3);
      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenNthCalledWith(
        1,
        'type',
        attributes,
        defaultType,
      );
      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenNthCalledWith(
        2,
        'order',
        attributes,
        defaultOrder,
      );
      expect(FormDecoratorHelper.getDefaultAttributes).toHaveBeenNthCalledWith(
        3,
        'validateIf',
        attributes,
        defaultValidateIf,
      );

      expect(FormDecoratorHelper['getInitialValue']).toHaveBeenCalledTimes(1);
      expect(FormDecoratorHelper['getInitialValue']).toHaveBeenCalledWith(
        false,
        undefined,
      );
    });
  });

  describe('generateInputChoiceMissingAttributes', () => {
    it('should add inline attribute key to false if no key was defined', () => {
      // Given
      const attributes = {
        type: Fields.RADIO,
      } as unknown as ChoiceAttributes;

      // When
      const result =
        FormDecoratorHelper.generateInputChoiceMissingAttributes(attributes);

      // Then
      expect(result).toStrictEqual({ ...attributes, inline: false });
    });

    it('should keep inline attribute key if it was defined', () => {
      // Given
      const attributes = {
        type: Fields.RADIO,
        inline: true,
      } as unknown as ChoiceAttributes;

      // When
      const result =
        FormDecoratorHelper.generateInputChoiceMissingAttributes(attributes);

      // Then
      expect(result).toStrictEqual(attributes);
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

      const isFilledErrorMessage = {
        content: 'isFilled_error',
        level: MessageLevelEnum.ERROR,
        priority: MessagePriorityEnum.ERROR,
      };

      const expected = {
        required: true,
        validators: [
          {
            name: 'isFilled',
            errorMessage: isFilledErrorMessage,
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
