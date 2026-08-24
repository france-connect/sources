import { ValidationArguments } from 'class-validator';

import {
  requireAtLeastOneOf,
  RequireAtLeastOneOfConstraint,
} from './require-at-least-one-of.validator';

describe('RequireAtLeastOneOf', () => {
  // Given
  const objectMock = {
    property1: 'value1',
    property2: 'value2',
    property3: 'value3',
  };

  it('should return "true" if at least one of the properties is provided', () => {
    // Given
    const properties = ['property1', 'property2', 'property3'];

    // When
    const result = requireAtLeastOneOf(objectMock, properties);

    // Then
    expect(result).toBe(true);
  });

  it('should return "false" if none of the properties is provided', () => {
    // Given
    const properties = [
      'missingProperty1',
      'missingProperty2',
      'missingProperty3',
    ];

    // When
    const result = requireAtLeastOneOf(objectMock, properties);

    // Then
    expect(result).toBe(false);
  });

  it('should return "true" if one of the properties is provided', () => {
    // Given
    const properties = ['property1', 'missingProperty2', 'missingProperty3'];

    // When
    const result = requireAtLeastOneOf(objectMock, properties);

    // Then
    expect(result).toBe(true);
  });
});

describe('RequireAtLeastOneOfConstraint', () => {
  let constraint: RequireAtLeastOneOfConstraint;
  // Given
  const properties = ['property1', 'property2', 'property3'];
  const value = {
    property1: 'value1',
    property2: 'value2',
    property3: 'value3',
  };

  const args = {
    constraints: [properties],
  } as unknown as ValidationArguments;

  beforeEach(() => {
    constraint = new RequireAtLeastOneOfConstraint();
  });

  describe('validate', () => {
    it('should return false if the value is not an object', () => {
      // Given
      const badValue = 'not an object';

      // When
      const result = constraint.validate(badValue, args);

      // Then
      expect(result).toBe(false);
    });

    it('should return false if the value is null', () => {
      // Given
      const badValue = null;

      // When
      const result = constraint.validate(badValue, args);

      // Then
      expect(result).toBe(false);
    });

    it('should call the validator with the value and the properties', () => {
      // Given
      constraint.validator = jest.fn();

      // When
      constraint.validate(value, args);

      // Then
      expect(constraint.validator).toHaveBeenCalledExactlyOnceWith(
        value,
        properties,
      );
    });

    it('should return the result of the validator', () => {
      // Given
      const expectedResult = Symbol('result');
      constraint.validator = jest.fn().mockReturnValue(expectedResult);

      // When
      const result = constraint.validate(value, args);

      // Then
      expect(constraint.validator).toHaveBeenCalledExactlyOnceWith(
        value,
        properties,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      // Given
      const message = constraint.defaultMessage(args);

      // Then
      expect(message).toBe(
        'At least one of property1, property2, property3 must be provided',
      );
    });
  });
});
