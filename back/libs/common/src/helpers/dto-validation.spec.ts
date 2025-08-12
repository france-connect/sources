// Needed to use the "spyOn" method of jest
import * as ClassTransformer from 'class-transformer';
import * as ClassValidator from 'class-validator';

import { ValidationError } from '@nestjs/common';

import { CommonDtoValidationException } from '../exceptions';
import {
  filteredByDto,
  getDtoErrors,
  getDtoInputWithErrors,
  getTransformed,
  getValidDto,
  validateDto,
  validateDtoSync,
} from './dto-validation';

describe('DtoValidation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('getTransformed', () => {
    it('should call "plainToInstance" from "class-transformer" with the given arguments', () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');

      class TestClass {}
      const plain = { foo: 'bar' };
      const resultValidationOptions = undefined;

      // When
      getTransformed(plain, TestClass);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });
  });

  describe('validateDto', () => {
    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call', async () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      // When
      await validateDto(plain, TestClass, validationOptions);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });

    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call with full options', async () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      // When
      await validateDto(plain, TestClass, validationOptions, transformOptions);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
    });

    it('should call "validate" from "class-validator" with given Dto', async () => {
      // Given
      jest.spyOn(ClassValidator, 'validate');

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      await validateDto(plain, TestClass, validationOptions);

      // Then
      expect(ClassValidator.validate).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validate).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should return an empty array if no error is found', async () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      const errors = await validateDto(plain, TestClass, validationOptions);

      // Then
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(0);
    });

    it('should return the "validate" call result', async () => {
      // Given
      const validateResult = [
        {
          property: 'foo',
          constraints: {
            Bar: 'oops !',
            Rab: 'oops too !',
          },
          children: [],
        },
      ];

      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue(validateResult);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      const errors = await validateDto(plain, TestClass, validationOptions);

      // Then
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(1);
      expect(errors).toMatchObject(validateResult);
    });
  });

  describe('getValidDto', () => {
    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call', async () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      // When
      await getValidDto(plain, TestClass, validationOptions);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });

    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call with full options', async () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      // When
      await getValidDto(plain, TestClass, validationOptions, transformOptions);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
    });

    it('should call "validate" from "class-validator" with given Dto', async () => {
      // Given
      jest.spyOn(ClassValidator, 'validate').mockResolvedValueOnce([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = {
        whitelist: false,
        forbidNonWhitelisted: false,
      };

      // When
      await getValidDto(plain, TestClass, validationOptions);

      // Then
      expect(ClassValidator.validate).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validate).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should throw a CommonDtoValidationException if errors are found', async () => {
      // Given
      jest
        .spyOn(ClassValidator, 'validate')
        .mockResolvedValueOnce([
          Symbol('error'),
        ] as unknown as ValidationError[]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = {
        whitelist: false,
        forbidNonWhitelisted: false,
      };

      // When / Then
      await expect(
        getValidDto(plain, TestClass, validationOptions),
      ).rejects.toThrow(CommonDtoValidationException);
    });

    it('should return transformed object if no errors are found', async () => {
      // Given
      const transformed = Symbol('transformed');
      jest
        .spyOn(ClassTransformer, 'plainToInstance')
        .mockReturnValue(transformed);
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      const errors = await getValidDto(plain, TestClass, validationOptions);

      // Then
      expect(errors).toBe(transformed);
    });
  });

  describe('validateDtoSync', () => {
    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call', () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validateSync').mockReturnValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      // When
      validateDtoSync(plain, TestClass, validationOptions);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });

    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call with full options', () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validateSync').mockReturnValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      // When
      validateDtoSync(plain, TestClass, validationOptions, transformOptions);

      // Then
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
    });

    it('should call "validateSync" from "class-validator" with given Dto', () => {
      // Given
      jest.spyOn(ClassValidator, 'validateSync');

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      validateDtoSync(plain, TestClass, validationOptions);

      // Then
      expect(ClassValidator.validateSync).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validateSync).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should return an empty array if no error is found', () => {
      // Given
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validateSync').mockReturnValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      const errors = validateDtoSync(plain, TestClass, validationOptions);

      // Then
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(0);
    });

    it('should return the "validateSync" call result', () => {
      // Given
      const validateResult = [
        {
          property: 'foo',
          constraints: {
            Bar: 'oops !',
            Rab: 'oops too !',
          },
          children: [],
        },
      ];

      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest
        .spyOn(ClassValidator, 'validateSync')
        .mockReturnValue(validateResult);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      const errors = validateDtoSync(plain, TestClass, validationOptions);

      // Then
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(1);
      expect(errors).toMatchObject(validateResult);
    });
  });

  describe('filteredByDto', () => {
    it('should call "plainToInstance" and "instanceToPlain" from "class-transformer"', async () => {
      // Given
      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      jest
        .spyOn(ClassTransformer, 'plainToInstance')
        .mockReturnValueOnce(plain);
      jest.spyOn(ClassValidator, 'validate').mockResolvedValueOnce([]);
      // the spyOn choose the wrong instanceToPlain definition :(
      jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockReturnValueOnce(plain as any);

      // When
      const result = await filteredByDto(plain, TestClass, validationOptions);

      // Then
      expect(result).toEqual({ errors: [], result: plain });
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
      expect(ClassTransformer.instanceToPlain).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.instanceToPlain).toHaveBeenCalledWith(plain);
    });

    it('should call "plainToInstance" and "instanceToPlain" from "class-transformer" with full options', async () => {
      // Given
      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValueOnce([]);
      // the spyOn choose the wrong instanceToPlain definition :(
      jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockReturnValueOnce(plain as any);

      // When
      const result = await filteredByDto(
        plain,
        TestClass,
        validationOptions,
        transformOptions,
      );

      // Then
      expect(result).toEqual({ errors: [], result: plain });
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
      expect(ClassTransformer.instanceToPlain).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.instanceToPlain).toHaveBeenCalledWith(plain);
    });

    it('should call "validate" from "class-validator" with given Dto', async () => {
      // Given
      jest.spyOn(ClassValidator, 'validate');

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // When
      await filteredByDto(plain, TestClass, validationOptions);

      // Then
      expect(ClassValidator.validate).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validate).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should return data if no error is found', async () => {
      // Given

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue([]);
      // the spyOn choose the wrong instanceToPlain definition :(
      jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockReturnValueOnce(plain as any);

      // When
      const { errors, result } = await filteredByDto(
        plain,
        TestClass,
        validationOptions,
      );

      // Then
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(0);
      expect(result).toEqual(plain);
    });

    it('should return the "validate" call result', async () => {
      // Given
      const validateResult = [
        {
          children: [],
          constraints: {
            Bar: 'oops !',
            Rab: 'oops too !',
          },
          property: 'foo',
        },
      ];

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue(validateResult);
      // the spyOn choose the wrong instanceToPlain definition :(
      const instanceToPlainMock = jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockReturnValueOnce(plain as any);

      // When
      const { errors, result } = await filteredByDto(
        plain,
        TestClass,
        validationOptions,
      );

      // Then
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(1);
      expect(errors).toMatchObject(validateResult);
      expect(result).toEqual(null);
      expect(instanceToPlainMock).toHaveBeenCalledTimes(0);
    });
  });
  describe('getAllPropertiesErrors', () => {
    it('should return "null" if no error is found', () => {
      // Given
      const validationErrors = [];

      // When
      const errors = getDtoErrors(validationErrors);

      // Then
      expect(errors).toStrictEqual(null);
    });

    it('should return an error if a constraint fails', () => {
      // Given
      const validationErrors = [
        {
          property: 'foo',
          constraints: {
            Bar: 'oops !',
          },
          children: [],
        },
      ];

      // When
      const error = getDtoErrors(validationErrors);

      // Then
      expect(error).toBeInstanceOf(Error);
    });

    it('should return an error with "message" containing all failed constraints formatted "<property>: <failed-constraint>" and "\n" separated', () => {
      // Given
      const validationErrors = [
        {
          property: 'foo',
          constraints: {
            Bar: 'oops !',
            Rab: 'oops too !',
          },
          children: [],
        },
        {
          property: 'thisOne',
          constraints: {
            ThaOne: 'oops too too !',
            ThatOtherOne: 'oops too too too !',
          },
          children: [],
        },
      ];
      const failedConstraints = [
        'foo: Bar',
        'foo: Rab',
        'thisOne: ThaOne',
        'thisOne: ThatOtherOne',
      ];
      const expectedErrorMessage = failedConstraints.join('\n');

      // When
      const error = getDtoErrors(validationErrors);

      // Then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toStrictEqual(expectedErrorMessage);
    });

    it('should work with nested validation and format failed contraints "<lvl1-property>.<...>.<levelN-property>: <failed-constraint>"', () => {
      // Given
      const validationErrors = [
        {
          property: 'foo',
          constraints: {
            Bar: 'oops !',
            Rab: 'oops too !',
          },
          children: [
            {
              property: 'thisOne',
              constraints: {
                ThaOne: 'oops too too !',
                ThatOtherOne: 'oops too too too !',
              },
              children: [
                {
                  property: 'name',
                  constraints: {
                    IsString: 'oops too too too too !',
                  },
                  children: [],
                },
                {
                  property: 'underwear',
                  constraints: {
                    IsString: 'oops too too too too too !',
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ];
      const failedConstraints = [
        'foo: Bar',
        'foo: Rab',
        'foo.thisOne: ThaOne',
        'foo.thisOne: ThatOtherOne',
        'foo.thisOne.name: IsString',
        'foo.thisOne.underwear: IsString',
      ];
      const expectedErrorMessage = failedConstraints.join('\n');

      // When
      const error = getDtoErrors(validationErrors);

      // Then
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toStrictEqual(expectedErrorMessage);
    });

    it('should work with no nested validation and field without contraints', () => {
      // Given
      const validationErrors = [
        {
          property: 'foo',
        },
      ];

      // When
      const error = getDtoErrors(validationErrors as any);

      // Then
      expect(error).toBe(null);
    });
  });

  describe('getDtoInputWithErrors', () => {
    it('should return structured inputs with errors if any', () => {
      // Given
      const errors = [
        {
          target: {
            sexe: 'F',
            birthdate: 'some not date string',
            birthplace: 'some place ok',
            email: 'not an email string',
          },
          value: 'some not date string',
          property: 'birthdate',
          children: [],
          constraints: {
            matches:
              'birthdate must match /^\\d{4}-\\d{2}-\\d{2}$/ regular expression',
          },
        },
        {
          target: {
            sexe: 'F',
            birthdate: 'some not date string',
            birthplace: 'some place ok',
            email: 'not an email string',
          },
          value: 'not an email string',
          property: 'email',
          children: [],
          constraints: {
            isEmail: 'email must be an email',
          },
        },
      ];
      // When
      const result = getDtoInputWithErrors(errors);

      // Then
      expect(result).toEqual({
        sexe: {
          value: 'F',
          errors: [],
        },
        birthdate: {
          value: 'some not date string',
          errors: [
            'birthdate must match /^\\d{4}-\\d{2}-\\d{2}$/ regular expression',
          ],
        },
        birthplace: {
          value: 'some place ok',
          errors: [],
        },
        email: {
          value: 'not an email string',
          errors: ['email must be an email'],
        },
      });
    });

    it('should return null if there are no errors', () => {
      // When
      const result = getDtoInputWithErrors([]);

      // Then
      expect(result).toBe(null);
    });
  });
});
