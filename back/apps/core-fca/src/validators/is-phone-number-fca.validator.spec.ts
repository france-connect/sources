import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { IsPhoneNumberFCAConstraint } from './is-phone-number-fca.validator';

const configMock = getConfigMock() as unknown as ConfigService;

const constraint = new IsPhoneNumberFCAConstraint(configMock);
describe('IsPhoneNumberFca', () => {
  describe('validate', () => {
    it('should return true when phone_number is valid', () => {
      const phoneNumberIdentity = {
        phone_number: '+33634283766',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(true);
    });

    it('should return true when phone_number is valid without "+"', () => {
      const phoneNumberIdentity = {
        phone_number: '0634283766',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(true);
    });

    it('should return true when phone_number contains spaces or dashes', () => {
      const phoneNumberIdentity = {
        phone_number: '+12 34-567 890',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(true);
    });
    it('should return false when phone_number is too long', () => {
      const phoneNumberIdentity = {
        phone_number: '+123456789012345678901234567890',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(false);
    });
    it('should return false when phone_number is too short', () => {
      const phoneNumberIdentity = {
        phone_number: '+123',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(false);
    });

    it('should return false when phone_number contains list of phones number', () => {
      const phoneNumberIdentity = {
        phone_number: '0634283769,0471432774',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(false);
    });

    it('should return false when phone_number contains special character', () => {
      const phoneNumberIdentity = {
        phone_number: '063428?3976',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(false);
    });

    it('should return false when phone_number is invalid', () => {
      const phoneNumberIdentity = {
        phone_number: 'invalid-phone',
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(false);
    });

    it('should return false when phone_number is null', () => {
      const phoneNumberIdentity = {
        phone_number: null,
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(false);
    });

    it('should return false when phone_number is undefined', () => {
      const phoneNumberIdentity = {
        phone_number: undefined,
      };
      const result = constraint.validate(phoneNumberIdentity.phone_number);
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return specific message if phone_number is invalid', () => {
      const error = constraint.defaultMessage();
      expect(error).toEqual('Le numéro de téléphone est invalide.');
    });
  });
});
