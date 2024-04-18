import type { Service, UserPreferencesData } from '../interfaces';
import {
  checkHasDefaultConfiguration,
  checkSomeIdpHasBeenChangedSinceLoading,
} from './user-preferences-form.util';

describe('user-preferences-form.util', () => {
  describe('checkHasDefaultConfiguration', () => {
    it('should return "false" if userPreferences is undefined', () => {
      // Given
      const userPreferences: UserPreferencesData | undefined = undefined;

      // When
      const result = checkHasDefaultConfiguration(userPreferences);

      // Then
      expect(result).toBeFalse();
    });

    it('should return "false" if idpList is undefined', () => {
      // Given
      const userPreferences: UserPreferencesData = {
        allowFutureIdp: true,
        idpList: undefined,
      };

      // When
      const result = checkHasDefaultConfiguration(userPreferences);

      // Then
      expect(result).toBeFalse();
    });

    it('should return "false" if allowFutureIdp is false', () => {
      // Given
      const userPreferences: UserPreferencesData = {
        allowFutureIdp: false,
        idpList: [],
      };

      // When
      const result = checkHasDefaultConfiguration(userPreferences);

      // Then
      expect(result).toBeFalse();
    });

    it('should return "true" if some idp in idpList not in default configuration and future idp are allowed', () => {
      // Given
      const userPreferences: UserPreferencesData = {
        allowFutureIdp: true,
        idpList: [{ isChecked: true } as Service],
      };

      // When
      const result = checkHasDefaultConfiguration(userPreferences);

      // Then
      expect(result).toBeTrue();
    });

    it('should return "false" if some idp in idpList not in default configuration and future idp are not allowed', () => {
      // Given
      const userPreferences: UserPreferencesData = {
        allowFutureIdp: false,
        idpList: [{ isChecked: true } as Service],
      };

      // When
      const result = checkHasDefaultConfiguration(userPreferences);

      // Then
      expect(result).toBeFalse();
    });
  });

  describe('checkSomeIdpHasBeenChangedSinceLoading', () => {
    it('should return "false" if no field is dirty', () => {
      // Given
      const dirtyFields: Record<string, boolean> = {};

      // When
      const result = checkSomeIdpHasBeenChangedSinceLoading(dirtyFields);

      // Then
      expect(result).toBeFalse();
    });

    it('should return "true" if some idp is dirty', () => {
      // Given
      const dirtyFields: Record<string, boolean> = {
        // This is the true format of dirtyFields
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'idpList.0.isChecked': true,
      };

      // When
      const result = checkSomeIdpHasBeenChangedSinceLoading(dirtyFields);

      // Then
      expect(result).toBeTrue();
    });
  });
});
