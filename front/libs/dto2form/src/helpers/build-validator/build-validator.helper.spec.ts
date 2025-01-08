import get from 'lodash.get';

import { Validators } from '../../enums';
import { buildValidator } from './build-validator.helper';

// Given
jest.mock('lodash.get', () => jest.fn());

describe('buildValidator', () => {
  it('should return a validate function', () => {
    // When
    const result = buildValidator({
      errorLabel: 'errorLabelMock',
      name: 'any-validator-name',
      validationArgs: ['validationArgsMock'],
    });

    // Then
    expect(result).toBeInstanceOf(Function);
  });

  describe('when calling the built validate function', () => {
    it('should return undefined when the field value is "   " and allowEmpty is true', () => {
      // When
      const validator = buildValidator({
        errorLabel: expect.any(String),
        name: expect.any(String),
        validationArgs: expect.any(Array),
      });
      const fieldValue = '     ' as unknown as string;
      const result = validator(fieldValue);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when the field value is an epty array and allowEmpty is true', () => {
      // When
      const validator = buildValidator({
        errorLabel: expect.any(String),
        name: expect.any(String),
        validationArgs: expect.any(Array),
      });
      const fieldValue = [] as unknown as string[];
      const result = validator(fieldValue);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when the field value is 0 and allowEmpty is true', () => {
      // When
      const validator = buildValidator({
        errorLabel: expect.any(String),
        name: expect.any(String),
        validationArgs: expect.any(Array),
      });
      const fieldValue = 0 as unknown as string;
      const result = validator(fieldValue);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when the field value is null and allowEmpty is true', () => {
      // When
      const validator = buildValidator({
        errorLabel: expect.any(String),
        name: expect.any(String),
        validationArgs: expect.any(Array),
      });
      const fieldValue = null as unknown as string;
      const result = validator(fieldValue);

      // Then
      expect(result).toBeUndefined();
    });

    it('should return undefined when the field value is undefined and allowEmpty is true', () => {
      // When
      const validator = buildValidator({
        errorLabel: expect.any(String),
        name: expect.any(String),
        validationArgs: expect.any(Array),
      });
      const fieldValue = undefined as unknown as string;
      const result = validator(fieldValue);

      // Then
      expect(result).toBeUndefined();
    });

    it('should call the defined validator and return undefined when value is valid', () => {
      // Given
      const validValueMock = true;
      const anyValidatorMock = jest.fn(() => validValueMock);

      const valueMock = Symbol('valueMock') as unknown as string;
      const validationArgsMock1 = Symbol('validationArgsMock1') as unknown as string;
      const validationArgsMock2 = Symbol('validationArgsMock2') as unknown as string;

      jest.mocked(get).mockReturnValueOnce(anyValidatorMock);

      // When
      const validator = buildValidator({
        errorLabel: expect.any(String),
        name: 'anyValidatorMock',
        validationArgs: [validationArgsMock1, validationArgsMock2],
      });
      const result = validator(valueMock);

      // Then
      expect(get).toHaveBeenCalledWith(Validators, 'anyValidatorMock');
      expect(anyValidatorMock).toHaveBeenCalledOnce();
      expect(anyValidatorMock).toHaveBeenCalledWith(
        valueMock,
        validationArgsMock1,
        validationArgsMock2,
      );

      expect(result).toBeUndefined();
    });

    it('should call "matches" validator with the match regex', () => {
      // Given
      const validValueMock = true;
      const anyValidatorMock = jest.fn(() => validValueMock);

      const valueMock = Symbol('valueMock') as unknown as string;

      jest.mocked(get).mockReturnValueOnce(anyValidatorMock);

      // When
      const validator = buildValidator({
        errorLabel: expect.any(String),
        name: 'matches',
        validationArgs: ['(an-regex-mock)'],
      });
      validator(valueMock);

      // Then
      expect(get).toHaveBeenCalledWith(Validators, 'matches');
      expect(anyValidatorMock).toHaveBeenCalledOnce();
      expect(anyValidatorMock).toHaveBeenCalledWith(valueMock, /(an-regex-mock)/);
    });

    it('should call the defined validator and return an error when value is not valid', () => {
      // Given
      const validValueMock = false;
      const anyValidatorMock = jest.fn(() => validValueMock);

      const valueMock = Symbol('valueMock') as unknown as string;
      const errorMessageMock = Symbol('errorMessageMock') as unknown as string;

      jest.mocked(get).mockReturnValueOnce(anyValidatorMock);

      // When
      const validator = buildValidator({
        errorLabel: errorMessageMock,
        name: 'anyValidatorMock',
      });
      const result = validator(valueMock);

      // Then
      expect(get).toHaveBeenCalledWith(Validators, 'anyValidatorMock');
      expect(anyValidatorMock).toHaveBeenCalledOnce();
      expect(anyValidatorMock).toHaveBeenCalledWith(valueMock);
      expect(result).toBe(errorMessageMock);
    });
  });
});
