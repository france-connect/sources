import type { UserInfosInterface } from '../../interfaces';
import { ConnectValidator } from './connect.validator';

describe('ConnectValidator', () => {
  describe('validate', () => {
    it('should return true if firstname and lastname are provided', () => {
      // Given
      const data = {
        firstname: 'John',
        lastname: 'Doe',
      } as UserInfosInterface;

      // When
      const result = ConnectValidator.validate(data);

      // Then
      expect(result).toBeTrue();
    });

    it('should return false if firstname is missing', () => {
      // Given
      const data = {
        lastname: 'Doe',
      } as UserInfosInterface;

      // When
      const result = ConnectValidator.validate(data);

      // Then
      expect(result).toBeFalse();
    });

    it('should return false if lastname is missing', () => {
      // Given
      const data = {
        firstname: 'John',
      } as UserInfosInterface;

      // When
      const result = ConnectValidator.validate(data);

      // Then
      expect(result).toBeFalse();
    });
  });
});
