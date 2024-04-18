import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { IsEqualToConfigConstraint } from './is-equal-to-config.validator';

describe('IsEqualToConfig', () => {
  let constraint;

  const configMock = getConfigMock();

  const argumentsMock = {
    constraints: ['FooConfig', 'barProperty'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    constraint = new IsEqualToConfigConstraint(
      configMock as unknown as ConfigService,
    );
  });

  describe('validate', () => {
    const refMock = {};
    const valuesToTest = [
      { config: 'equals', value: 'equals', expected: true },
      { config: 'equals', value: 'notEquals', expected: false },
      { config: 1, value: 1, expected: true },
      { config: 1, value: 2, expected: false },
      { config: true, value: true, expected: true },
      { config: true, value: false, expected: false },
      { config: refMock, value: refMock, expected: true },
      { config: refMock, value: {}, expected: false },
      { config: undefined, value: undefined, expected: true },
      { config: undefined, value: null, expected: false },
      { config: null, value: null, expected: true },
      { config: null, value: undefined, expected: false },
    ];

    it.each(valuesToTest)(
      'should return "$expected" when config is "$config" and value is "$value"',
      ({ config, value, expected }) => {
        // Given
        configMock.get.mockReturnValueOnce({
          barProperty: config,
        });

        // When
        const result = constraint.validate(value, argumentsMock);

        // Then
        expect(result).toBe(expected);
      },
    );
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      // Given
      configMock.get.mockReturnValueOnce({
        barProperty: 'equals',
      });

      // When
      const result = constraint.defaultMessage({
        ...argumentsMock,
        value: 'notEquals',
      });

      // Then
      expect(result).toBe(
        'barProperty allows only theses values: "equals", got: "notEquals"',
      );
    });
  });
});
