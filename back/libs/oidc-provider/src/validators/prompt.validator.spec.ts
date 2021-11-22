import { ConfigService } from '@fc/config';

import { IsValidPromptConstraint } from './prompt.validator';

describe('IsValidPromptConstraint', () => {
  let constraint;

  const configMock = {
    get: jest.fn(),
  };

  const argumentsMock = {
    constraints: ['path'],
  };

  const resultsMock = ['boots', 'clothes', 'motorcycle'];

  beforeEach(() => {
    jest.clearAllMocks();
    configMock.get.mockReturnValueOnce({
      forcedPrompt: resultsMock,
    });
    constraint = new IsValidPromptConstraint(
      configMock as unknown as ConfigService,
    );
  });

  describe('getAllowedList', () => {
    it('should the list from config', () => {
      // arrange
      // action
      const valid = constraint.getAllowedList({});

      // assert
      expect(valid).toStrictEqual(resultsMock);
    });
  });

  describe('validate', () => {
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
    beforeEach(() => {
      configMock.get.mockReturnValueOnce({
        forcedPrompt: resultsMock,
      });
    });

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
        constraints: [],
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
