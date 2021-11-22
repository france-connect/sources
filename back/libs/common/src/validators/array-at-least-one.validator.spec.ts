import {
  arrayAtLeastOne,
  ArrayAtLeastOneConstraint,
} from './array-at-least-one.validator';

describe('arrayAtLeastOne', () => {
  const allowedMock = ['boots', 'clothes', 'motorcycle'];

  it('should return "true" if the array include one of the values allowed', () => {
    // setup
    const array = ['clothes'];

    // action
    const valid = arrayAtLeastOne(allowedMock, array);

    // assert
    expect(valid).toStrictEqual(true);
  });

  it('should return "true" if the array include two of the values allowed', () => {
    // setup
    const array = ['boots', 'motorcycle'];

    // action
    const valid = arrayAtLeastOne(allowedMock, array);

    // assert
    expect(valid).toStrictEqual(true);
  });

  it('should return "true" if the array include all the values allowed', () => {
    // setup
    const array = ['boots', 'clothes', 'motorcycle'];

    // action
    const valid = arrayAtLeastOne(allowedMock, array);

    // assert
    expect(valid).toStrictEqual(true);
  });

  it('should return "true" if the array include one of the values allowed plus another unknown', () => {
    // setup
    const array = ['clothes', 'SarahConnor'];

    // action
    const valid = arrayAtLeastOne(allowedMock, array);

    // assert
    expect(valid).toStrictEqual(true);
  });

  it('should return "false" if the array none of the values allowed', () => {
    // setup
    const array = ['I will be back 👍'];

    // action
    const valid = arrayAtLeastOne(allowedMock, array);

    // assert
    expect(valid).toStrictEqual(false);
  });
});

describe('ArrayAtLeastOneConstraint', () => {
  let constraint;

  beforeEach(() => {
    constraint = new ArrayAtLeastOneConstraint();
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
      // setup
      const value = ['clothes'];

      // action
      const valid = constraint.validate(value, argumentsMock);

      // assert
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the value include two of the values allowed', () => {
      // setup
      const value = ['boots', 'motorcycle'];

      // action
      const valid = constraint.validate(value, argumentsMock);

      // assert
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the value include all the values allowed', () => {
      // setup
      const value = ['boots', 'clothes', 'motorcycle'];

      // action
      const valid = constraint.validate(value, argumentsMock);

      // assert
      expect(valid).toStrictEqual(true);
    });

    it('should return "true" if the value include one of the values allowed plus another unknown', () => {
      // setup
      const value = ['clothes', 'SarahConnor'];

      // action
      const valid = constraint.validate(value, argumentsMock);

      // assert
      expect(valid).toStrictEqual(true);
    });

    it('should return "false" if the value none of the values allowed', () => {
      // setup
      const value = ['I will be back 👍'];

      // action
      const valid = constraint.validate(value, argumentsMock);

      // assert
      expect(valid).toStrictEqual(false);
    });

    it('should return "false" the value is not an array', () => {
      // setup
      const value = 'Not an array';

      // action
      const valid = constraint.validate(value, argumentsMock);

      // assert
      expect(valid).toStrictEqual(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return a formatted error message', () => {
      // setup
      const validationArguments = {
        value: ['I', 'will', 'be', 'back 👍'],
        property: 'Terminator',
        constraints: [['boots', 'clothes', 'motorcycle']],
      };

      // action
      const message = constraint.defaultMessage(validationArguments);

      // assert
      expect(message).toStrictEqual(
        'Terminator allows only theses values: "boots, clothes, motorcycle", got: "I, will, be, back 👍"',
      );
    });
    it('should return a formatted error message with no-array value', () => {
      // setup
      const validationArguments = {
        value: 'I will be back 👍',
        property: 'Terminator',
        constraints: [['boots', 'clothes', 'motorcycle']],
      };

      // action
      const message = constraint.defaultMessage(validationArguments);

      // assert
      expect(message).toStrictEqual(
        'Terminator allows only theses values: "boots, clothes, motorcycle", got: "I will be back 👍"',
      );
    });

    it('should return a formatted error message with an undefined value', () => {
      // setup
      const validationArguments = {
        value: undefined,
        property: 'Terminator',
        constraints: [['boots', 'clothes', 'motorcycle']],
      };

      // action
      const message = constraint.defaultMessage(validationArguments);

      // assert
      expect(message).toStrictEqual(
        'Terminator allows only theses values: "boots, clothes, motorcycle", got: "undefined"',
      );
    });
  });
});
