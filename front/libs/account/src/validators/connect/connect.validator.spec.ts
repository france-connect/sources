import type { UserInfosInterface } from '../../interfaces';
import { ConnectValidator } from './connect.validator';

describe('ConnectValidator', () => {
  describe('validate', () => {
    it('should return true if firstname and lastname are provided', () => {
      // given
      const data = {
        firstname: 'John',
        lastname: 'Doe',
      } as UserInfosInterface;

      // when
      const result = ConnectValidator.validate(data);

      // then
      expect(result).toBeTrue();
    });

    it('should return false if firstname is missing', () => {
      // given
      const data = {
        lastname: 'Doe',
      } as UserInfosInterface;

      // when
      const result = ConnectValidator.validate(data);

      // then
      expect(result).toBeFalse();
    });

    it('should return false if lastname is missing', () => {
      // given
      const data = {
        firstname: 'John',
      } as UserInfosInterface;

      // when
      const result = ConnectValidator.validate(data);

      // then
      expect(result).toBeFalse();
    });
  });
});
