import { TransformFnParams } from 'class-transformer';

import { defaultToFranceBirthcountry } from './custom-identity.dto';

describe('CustomIdentityDto', () => {
  describe('defaultToFranceBirthcountry', () => {
    it('should return 99100 if birthcountry is empty', () => {
      const params = {
        obj: {
          birthcountry: '',
        },
      } as TransformFnParams;
      expect(defaultToFranceBirthcountry(params)).toEqual('99100');
    });

    it('should return birthcountry if birthcountry is not empty', () => {
      const params = {
        obj: {
          birthcountry: 'test',
        },
      } as TransformFnParams;
      expect(defaultToFranceBirthcountry(params)).toEqual('test');
    });
  });
});
