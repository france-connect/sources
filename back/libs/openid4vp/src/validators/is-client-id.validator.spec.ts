import { ValidationArguments } from 'class-validator';

import { Openid4vpClientIdSchemeEnum } from '../enums';
import { IsClientIdConstraint } from './is-client-id.validator';

describe('IsClientIdConstraint', () => {
  let constraint: IsClientIdConstraint;

  beforeEach(() => {
    constraint = new IsClientIdConstraint();
  });

  describe('validate', () => {
    describe('when the client_id_scheme is redirect_uri', () => {
      it('should return true if the client_id is a valid URL', () => {
        // Given
        const value = 'https://example.com';
        const args = {
          object: {
            client_id_scheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
          },
        } as ValidationArguments;

        // When
        const result = constraint.validate(value, args);

        // Then
        expect(result).toBe(true);
      });

      it('should return false if the client_id is not a valid URL', () => {
        // Given
        const value = 'not-a-valid-url';
        const args = {
          object: {
            client_id_scheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
          },
        } as ValidationArguments;

        // When
        const result = constraint.validate(value, args);

        // Then
        expect(result).toBe(false);
      });
    });

    describe('when the client_id_scheme is x509_hash', () => {
      it('should return true if the client_id is a valid x509 hash', () => {
        // Given
        const value = 'x509_hash:1234567890';
        const args = {
          object: {
            client_id_scheme: Openid4vpClientIdSchemeEnum.X509_HASH,
          },
        } as ValidationArguments;

        // When
        const result = constraint.validate(value, args);

        // Then
        expect(result).toBe(true);
      });

      it('should return false if the client_id is not a valid x509 hash', () => {
        // Given
        const value = 'not-a-valid-x509-hash';
        const args = {
          object: {
            client_id_scheme: Openid4vpClientIdSchemeEnum.X509_HASH,
          },
        } as ValidationArguments;

        // When
        const result = constraint.validate(value, args);

        // Then
        expect(result).toBe(false);
      });
    });

    describe('when the client_id_scheme is unknown', () => {
      it('should return false', () => {
        // Given
        const value = 'some value';
        const args = {
          object: { client_id_scheme: 'unknown scheme' },
        } as ValidationArguments;

        // When
        const result = constraint.validate(value, args);

        // Then
        expect(result).toBe(false);
      });
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      // Given

      // When
      const result = constraint.defaultMessage();

      // Then
      expect(result).toBe('The value must be a valid client_id');
    });
  });
});
