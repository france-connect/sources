// Needed to use the "spyOn" method of jest
import * as ClassTransformer from 'class-transformer';
import * as ClassValidator from 'class-validator';

import {
  filteredByDto,
  getDtoErrors,
  getTransformed,
  validateDto,
} from './dto-validation';

describe('DtoValidation', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('getTransformed', () => {
    it('should call "plainToClass" from "class-transformer" with the given arguments', () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToClass');

      class TestClass {}
      const plain = { foo: 'bar' };
      const resultValidationOptions = undefined;

      // action
      getTransformed(plain, TestClass);

      // expect
      expect(ClassTransformer.plainToClass).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToClass).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });
  });

  describe('validateDto', () => {
    it('should call "plainToClass" from "class-transformer" through "getTransformed" call', async () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToClass');
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      // action
      await validateDto(plain, TestClass, validationOptions);

      // expect
      expect(ClassTransformer.plainToClass).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToClass).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
    });

    it('should call "plainToClass" from "class-transformer" through "getTransformed" call with full options', async () => {
      // setup
      jest.spyOn(ClassTransformer, 'plainToClass');
      jest.spyOn(ClassValidator, 'validate').mockImplementation(async () => []);

      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      // action
      await validateDto(plain, TestClass, validationOptions, transformOptions);

      // expect
      expect(ClassTransformer.plainToClass).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToClass).toHaveBeenCalledWith(
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
      jest.spyOn(ClassTransformer, 'plainToClass');
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

      jest.spyOn(ClassTransformer, 'plainToClass');
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

  describe('filteredByDto', () => {
    it('should call "plainToClass" and "classToPlain" from "class-transformer"', async () => {
      // setup
      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const resultValidationOptions = undefined;

      jest.spyOn(ClassTransformer, 'plainToClass').mockReturnValueOnce(plain);
      jest.spyOn(ClassValidator, 'validate').mockResolvedValueOnce([]);
      // the spyOn choose the wrong classToPlain definition :(
      jest
        .spyOn(ClassTransformer, 'classToPlain')
        .mockReturnValueOnce(plain as any);

      // action
      const result = await filteredByDto(plain, TestClass, validationOptions);

      // expect
      expect(result).toEqual({ errors: [], result: plain });
      expect(ClassTransformer.plainToClass).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToClass).toHaveBeenCalledWith(
        TestClass,
        plain,
        resultValidationOptions,
      );
      expect(ClassTransformer.classToPlain).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.classToPlain).toHaveBeenCalledWith(plain);
    });

    it('should call "plainToClass" and "classToPlain" from "class-transformer" with full options', async () => {
      // setup
      class TestClass {}
      const plain = { foo: 'bar' };
      const validationOptions = { whitelist: false };
      const transformOptions = { groups: ['hello'] };

      jest.spyOn(ClassTransformer, 'plainToClass');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValueOnce([]);
      // the spyOn choose the wrong classToPlain definition :(
      jest
        .spyOn(ClassTransformer, 'classToPlain')
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
      expect(ClassTransformer.plainToClass).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.plainToClass).toHaveBeenCalledWith(
        TestClass,
        plain,
        transformOptions,
      );
      expect(ClassTransformer.classToPlain).toHaveBeenCalledTimes(1);
      expect(ClassTransformer.classToPlain).toHaveBeenCalledWith(plain);
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

      jest.spyOn(ClassTransformer, 'plainToClass');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue([]);
      // the spyOn choose the wrong classToPlain definition :(
      jest
        .spyOn(ClassTransformer, 'classToPlain')
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

      jest.spyOn(ClassTransformer, 'plainToClass');
      jest.spyOn(ClassValidator, 'validate').mockResolvedValue(validateResult);
      // the spyOn choose the wrong classToPlain definition :(
      const classToPlainMock = jest
        .spyOn(ClassTransformer, 'classToPlain')
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
      expect(classToPlainMock).toHaveBeenCalledTimes(0);
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
});
