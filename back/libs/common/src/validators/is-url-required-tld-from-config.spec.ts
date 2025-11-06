import { ValidationArguments } from 'class-validator';

import { ConfigService } from '@fc/config';

import { IsUrlRequiredTldFromConfigConstraint } from './is-url-required-tld-from-config';

const configMock = {
  get: jest.fn(),
};

const instance = new IsUrlRequiredTldFromConfigConstraint(
  configMock as unknown as ConfigService,
);

const configName = 'SomeModuleConfig';
const propertyName = 'someProperty';

const constraints = [configName, propertyName];

describe('IsUrlRequiredTldFromConfig', () => {
  const valuesToTestLocalhostNotAllowed = [
    {
      value: 'https://doretdeplatineshop.com/fr-fr/',
      expected: true,
      context: 'the URL is valid',
    },
    {
      value: 'https://localhost/oidc-callback',
      expected: true,
      context: 'someProperty = false',
    },
    {
      value: 'http://localhost/oidc-callback',
      expected: true,
      context: 'someProperty = false',
    },
    {
      value: 'http://localhost:3000',
      expected: true,
      context: 'someProperty = false',
    },
  ];

  const valuesToTestLocalhostAllowed = [
    {
      value: 'http://localhost:3000/oidc-callback',
      expected: false,
      context: `contain port, path and without ssl certificate`,
    },
    {
      value: 'https://localhost:3000/oidc-callback',
      expected: false,
      context: 'contain port & path',
    },
    {
      value: 'localhost',
      expected: false,
      context: `dosn't contain protocol`,
    },
    {
      value: 'localhost:3000',
      expected: false,
      context: `dosn't contain protocol & has port`,
    },
    {
      value: 'http//localhost:3000/oidc-callback/',
      expected: false,
      context: 'are invalid',
    },
    {
      value: 'http://localhost:3000.fr',
      expected: false,
      context: 'have localhost and extension domain',
    },
    {
      value: 'https://doretdeplatineshop.com/fr-fr/',
      expected: true,
      context: 'are valid url',
    },
  ];

  describe('validate', () => {
    it.each(valuesToTestLocalhostNotAllowed)(
      'should return "$expected" if we receive the url "$value" and $context',
      ({ value, expected }) => {
        // Given
        configMock.get.mockReturnValueOnce({
          someProperty: false,
        });

        // When
        const result = instance.validate(value, {
          constraints,
        } as ValidationArguments);

        // Then
        expect(result).toStrictEqual(expected);
      },
    );

    it.each(valuesToTestLocalhostAllowed)(
      'should return "$expected" if redirect_uris and post_logout_redirect_uris $context',
      ({ value, expected }) => {
        // Given
        configMock.get.mockReturnValueOnce({
          someProperty: true,
        });

        // When
        const result = instance.validate(value, {
          constraints,
        } as ValidationArguments);

        // Then
        expect(result).toStrictEqual(expected);
      },
    );
  });

  describe('defaultMessage', () => {
    const invalidURL = 'URL is invalid';

    it('should return the default message : $defaultMessage', () => {
      // given
      configMock.get.mockReturnValueOnce({
        someProperty: true,
      });

      const instance = new IsUrlRequiredTldFromConfigConstraint(
        configMock as unknown as ConfigService,
      );

      // when
      const result = instance.defaultMessage();

      // then
      expect(result).toStrictEqual(invalidURL);
    });
  });
});
