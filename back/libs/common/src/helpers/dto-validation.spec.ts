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
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');

      class TestClass {}
      const plain = { foo: 'bar' };
      const resultValidationOptions = undefined;

      // action
      getTransformed(plain, TestClass);

      // expect
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
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      // action
      await validateDto(plain, TestClass, validationOptions);

      // expect
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });

    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call with full options', async () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      // action
      await validateDto(plain, TestClass, validationOptions, transformOptions);

      // expect
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
    });

    it('should call "validate" from "class-validator" with given Dto', async () => {
      // setup
      jest.spyOn(ClassValidator, 'validate');

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // action
      await validateDto(plain, TestClass, validationOptions);

      // expect
      expect(ClassValidator.validate).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validate).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should return an empty array if no error is found', async () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // action
      const errors = await validateDto(plain, TestClass, validationOptions);

      // expect
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(0);
    });

    it('should return the "validate" call result', async () => {
      // setup
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

      // action
      const errors = await validateDto(plain, TestClass, validationOptions);

      // expect
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(1);
      expect(errors).toMatchObject(validateResult);
    });
  });

  describe('getValidDto', () => {
    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call', async () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      // action
      await getValidDto(plain, TestClass, validationOptions);

      // expect
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });

    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call with full options', async () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      // Original function is async, so is the mock (not a call here)
      // eslint-disable-next-line require-await
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      // action
      await getValidDto(plain, TestClass, validationOptions, transformOptions);

      // expect
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
    });

    it('should call "validate" from "class-validator" with given Dto', async () => {
      // setup
      jest.spyOn(ClassValidator, 'validate').mockResolvedValueOnce([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = {
        whitelist: false,
        forbidNonWhitelisted: false,
      };

      // action
      await getValidDto(plain, TestClass, validationOptions);

      // expect
      expect(ClassValidator.validate).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validate).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should throw a CommonDtoValidationException if errors are found', async () => {
      // setup
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

      // action / expect
      await expect(
        getValidDto(plain, TestClass, validationOptions),
      ).rejects.toThrow(CommonDtoValidationException);
    });

    it('should return transformed object if no errors are found', async () => {
      // setup
      const transformed = Symbol('transformed');
      jest
        .spyOn(ClassTransformer, 'plainToInstance')
        .mockReturnValue(transformed);
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // action
      const errors = await getValidDto(plain, TestClass, validationOptions);

      // expect
      expect(errors).toBe(transformed);
    });
  });

  describe('validateDtoSync', () => {
    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call', () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validateSync').mockReturnValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      // action
      validateDtoSync(plain, TestClass, validationOptions);

      // expect
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });

    it('should call "plainToInstance" from "class-transformer" through "getTransformed" call with full options', () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validateSync').mockReturnValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      // action
      validateDtoSync(plain, TestClass, validationOptions, transformOptions);

      // expect
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToInstance).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
    });

    it('should call "validateSync" from "class-validator" with given Dto', () => {
      // setup
      jest.spyOn(ClassValidator, 'validateSync');

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // action
      validateDtoSync(plain, TestClass, validationOptions);

      // expect
      expect(ClassValidator.validateSync).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validateSync).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should return an empty array if no error is found', () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validateSync').mockReturnValue([]);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // action
      const errors = validateDtoSync(plain, TestClass, validationOptions);

      // expect
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(0);
    });

    it('should return the "validateSync" call result', () => {
      // setup
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

      // action
      const errors = validateDtoSync(plain, TestClass, validationOptions);

      // expect
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(1);
      expect(errors).toMatchObject(validateResult);
    });
  });

  describe('filteredByDto', () => {
    it('should call "plainToInstance" and "instanceToPlain" from "class-transformer"', async () => {
      // setup
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

      // action
      const result = await filteredByDto(plain, TestClass, validationOptions);

      // expect
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
      // setup
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

      // action
      const result = await filteredByDto(
        plain,
        TestClass,
        validationOptions,
        transformOptions,
      );

      // expect
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
      // setup
      jest.spyOn(ClassValidator, 'validate');

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      // action
      await filteredByDto(plain, TestClass, validationOptions);

      // expect
      expect(ClassValidator.validate).toHaveBeenCalledTimes(1);
      expect(ClassValidator.validate).toHaveBeenCalledWith(
        plain,
        validationOptions,
      );
    });

    it('should return data if no error is found', async () => {
      // setup

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };

      jest.spyOn(ClassTransformer, 'plainToInstance');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue([]);
      // the spyOn choose the wrong instanceToPlain definition :(
      jest
        .spyOn(ClassTransformer, 'instanceToPlain')
        .mockReturnValueOnce(plain as any);

      // action
      const { errors, result } = await filteredByDto(
        plain,
        TestClass,
        validationOptions,
      );

      // expect
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(0);
      expect(result).toEqual(plain);
    });

    it('should return the "validate" call result', async () => {
      // setup
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

      // action
      const { errors, result } = await filteredByDto(
        plain,
        TestClass,
        validationOptions,
      );

      // expect
      expect(errors).toBeInstanceOf(Array);
      expect(errors.length).toStrictEqual(1);
      expect(errors).toMatchObject(validateResult);
      expect(result).toEqual(null);
      expect(instanceToPlainMock).toHaveBeenCalledTimes(0);
    });
  });
  describe('getAllPropertiesErrors', () => {
    it('should return "null" if no error is found', () => {
      // setup
      const validationErrors = [];

      // action
      const errors = getDtoErrors(validationErrors);

      // expect
      expect(errors).toStrictEqual(null);
    });

    it('should return an error if a constraint fails', () => {
      // setup
      const validationErrors = [
        {
          property: 'foo',
          constraints: {
            Bar: 'oops !',
          },
          children: [],
        },
      ];

      // action
      const error = getDtoErrors(validationErrors);

      // expect
      expect(error).toBeInstanceOf(Error);
    });

    it('should return an error with "message" containing all failed constraints formatted "<property>: <failed-constraint>" and "\n" separated', () => {
      // setup
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

      // action
      const error = getDtoErrors(validationErrors);

      // expect
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toStrictEqual(expectedErrorMessage);
    });

    it('should work with nested validation and format failed contraints "<lvl1-property>.<...>.<levelN-property>: <failed-constraint>"', () => {
      // setup
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

      // action
      const error = getDtoErrors(validationErrors);

      // expect
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toStrictEqual(expectedErrorMessage);
    });

    it('should work with no nested validation and field without contraints', () => {
      // setup
      const validationErrors = [
        {
          property: 'foo',
        },
      ];

      // action
      const error = getDtoErrors(validationErrors as any);

      // expect
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
