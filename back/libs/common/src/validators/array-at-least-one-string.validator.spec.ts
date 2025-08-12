import {
  arrayAtLeastOneString,
  ArrayAtLeastOneStringConstraint,
} from './array-at-least-one-string.validator';

describe('arrayAtLeastOneString', () => {
  const allowedMock = ['boots', 'clothes', 'motorcycle'];

  it('should return "true" if the array include one of the values allowed', () => {
    // Given
    const array = ['clothes'];

    // When
    const valid = arrayAtLeastOneString(allowedMock, array);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should return "true" if the array include two of the values allowed', () => {
    // Given
    const array = ['boots', 'motorcycle'];

    // When
    const valid = arrayAtLeastOneString(allowedMock, array);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should return "true" if the array include all the values allowed', () => {
    // Given
    const array = ['boots', 'clothes', 'motorcycle'];

    // When
    const valid = arrayAtLeastOneString(allowedMock, array);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should return "true" if the array include one of the values allowed plus another unknown', () => {
    // Given
    const array = ['clothes', 'SarahConnor'];

    // When
    const valid = arrayAtLeastOneString(allowedMock, array);

    // Then
    expect(valid).toStrictEqual(true);
  });

  it('should return "false" if the array none of the values allowed', () => {
    // Given
    const array = ['I will be back 👍'];

    // When
    const valid = arrayAtLeastOneString(allowedMock, array);

    // Then
    expect(valid).toStrictEqual(false);
  });
});

describe('ArrayAtLeastOneStringConstraint', () => {
  let constraint;

  beforeEach(() => {
    constraint = new ArrayAtLeastOneStringConstraint();
  });

  describe('getAllowedList', () => {
    it('should return value from constraints', () => {
      const resultsMock = ['boots', 'clothes', 'motorcycle'];
      const validationArguments = {
        constraints: [resultsMock],
      };

      const valid = constraint.getAllowedList(validationArguments);

      expect(valid).toStrictEqual(resultsMock);
    });
    it('should not return value from constraints', () => {
      const resultsMock = ['boots', 'clothes', 'motorcycle'];
      const validationArguments = {
        constraints: ['wrong value', resultsMock],
      };

      const invalid = constraint.getAllowedList(validationArguments);

      expect(invalid).toStrictEqual('wrong value');
    });

    it('should throw error if there is no constraint', () => {
      const validationArguments = {};

      expect(() => constraint.getAllowedList(validationArguments)).toThrow();
    });
  });

  describe('validate', () => {
    const argumentsMock = {
      constraints: [['boots', 'clothes', 'motorcycle']],
    };

    it('should return "true" if the array include one of the values allowed', () => {
      // Given
      const value = ['clothes'];

      // When
      const valid = constraint.validate(value, argumentsMock);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the value include two of the values allowed', () => {
      // Given
      const value = ['boots', 'motorcycle'];

      // When
      const valid = constraint.validate(value, argumentsMock);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the value include all the values allowed', () => {
      // Given
      const value = ['boots', 'clothes', 'motorcycle'];

      // When
      const valid = constraint.validate(value, argumentsMock);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the value include one of the values allowed plus another unknown', () => {
      // Given
      const value = ['clothes', 'SarahConnor'];

      // When
      const valid = constraint.validate(value, argumentsMock);

      // Then
      expect(valid).toStrictEqual(true);
    });

    it('should return "false" if the value none of the values allowed', () => {
      // Given
      const value = ['I will be back 👍'];

      // When
      const valid = constraint.validate(value, argumentsMock);

      // Then
      expect(valid).toStrictEqual(false);
    });

    it('should return "false" the value is not an array', () => {
      // Given
      const value = 'Not an array';

      // When
      const valid = constraint.validate(value, argumentsMock);

      // Then
      expect(valid).toStrictEqual(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return a formatted error message', () => {
      // Given
      const validationArguments = {
        value: ['I', 'will', 'be', 'back 👍'],
        property: 'Terminator',
        constraints: [['boots', 'clothes', 'motorcycle']],
      };

      // When
      const message = constraint.defaultMessage(validationArguments);

      // Then
      expect(message).toStrictEqual(
        'Terminator allows only theses values: "boots, clothes, motorcycle", got: "I, will, be, back 👍"',
      );
    });
    it('should return a formatted error message with no-array value', () => {
      // Given
      const validationArguments = {
        value: 'I will be back 👍',
        property: 'Terminator',
        constraints: [['boots', 'clothes', 'motorcycle']],
      };

      // When
      const message = constraint.defaultMessage(validationArguments);

      // Then
      expect(message).toStrictEqual(
        'Terminator allows only theses values: "boots, clothes, motorcycle", got: "I will be back 👍"',
      );
    });

    it('should return a formatted error message with an undefined value', () => {
      // Given
      const validationArguments = {
        value: undefined,
        property: 'Terminator',
        constraints: [['boots', 'clothes', 'motorcycle']],
      };

      // When
      const message = constraint.defaultMessage(validationArguments);

      // Then
      expect(message).toStrictEqual(
        'Terminator allows only theses values: "boots, clothes, motorcycle", got: "undefined"',
      );
    });
  });
});
