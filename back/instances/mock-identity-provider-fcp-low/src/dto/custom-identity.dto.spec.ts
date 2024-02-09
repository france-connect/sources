import { TransformFnParams } from 'class-transformer';

import {
  defaultToFranceBirthcountry,
  noForeignBirthplaces,
} from './custom-identity.dto';

describe('CustomIdentityDto', () => {
  describe('noForeignBirthplaces', () => {
    it('should return empty string if birthcountry is not 99100', () => {
      const params = {
        obj: {
          birthcountry: '99101',
          birthplace: 'test',
        },
      } as TransformFnParams;
      expect(noForeignBirthplaces(params)).toEqual('');
    });

    it('should return birthplace if birthcountry is 99100', () => {
      const params = {
        obj: {
          birthcountry: '99100',
          birthplace: 'test',
        },
      } as TransformFnParams;
      expect(noForeignBirthplaces(params)).toEqual('test');
    });

    it('should return birthplace if birthcountry is empty', () => {
      const params = {
        obj: {
          birthcountry: '',
          birthplace: 'test',
        },
      } as TransformFnParams;
      expect(noForeignBirthplaces(params)).toEqual('test');
    });
  });

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
