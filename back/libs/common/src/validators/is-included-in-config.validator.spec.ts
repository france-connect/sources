import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { IsIncludedInConfigConstraint } from './is-included-in-config.validator';

describe('IsIncludedInConfig', () => {
  let constraint;

  const configMock = getConfigMock();

  const argumentsMock = {
    constraints: ['FooConfig', 'barProperty'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    constraint = new IsIncludedInConfigConstraint(
      configMock as unknown as ConfigService,
    );
  });

  describe('validate', () => {
    const refMock = {};
    const valuesToTest = [
      // Config includes value(s)
      { expected: true, config: ['london', 'paris'], value: 'london' },
      { expected: true, config: ['london', 'paris'], value: ['london'] },
      {
        expected: true,
        config: ['london', 'paris'],
        value: ['london', 'paris'],
      },
      // Config doesn't include any value
      { expected: false, config: ['london', 'paris'], value: 'barcelona' },
      { expected: false, config: ['london', 'paris'], value: ['barcelona'] },
      {
        expected: false,
        config: ['london', 'paris'],
        value: ['barcelona', 'madrid'],
      },
      // Config is not an array
      { expected: false, config: 'london', value: 'london' },
      { expected: false, config: 'london', value: ['london'] },
      // Special cases
      { expected: true, config: [true], value: true },
      { expected: true, config: [null], value: null },
      { expected: true, config: [null], value: [null] },
      { expected: true, config: [refMock], value: refMock },
      { expected: true, config: [null], value: [null] },
      { expected: false, config: [null], value: undefined },
      { expected: false, config: [refMock], value: {} },
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
        barProperty: ['Paris', 'London'],
      });

      // When
      const result = constraint.defaultMessage({
        ...argumentsMock,
        value: 'Barcelona',
      });

      // Then
      expect(result).toBe(
        'barProperty allows only theses values: "Paris,London", got: "Barcelona"',
      );
    });
  });
});
