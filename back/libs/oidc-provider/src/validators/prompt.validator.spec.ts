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
      allowedPrompt: resultsMock,
    });
    constraint = new IsValidPromptConstraint(
      configMock as unknown as ConfigService,
    );
  });

  describe('getAllowedList', () => {
    it('should the list from config', () => {
      // Given
      // When
      const valid = constraint.getAllowedList({});

      // Then
      expect(valid).toStrictEqual(resultsMock);
    });
  });

  describe('validate', () => {
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
    beforeEach(() => {
      configMock.get.mockReturnValueOnce({
        allowedPrompt: resultsMock,
      });
    });

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
        constraints: [],
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
