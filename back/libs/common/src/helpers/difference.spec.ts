import { difference } from './difference';

describe('difference', () => {
  it('should return the difference between two array', () => {
    // setup
    const array1 = ['foo', 'bar', 'toto'];
    const array2 = ['toto', 'titi'];
    const resultExpected = ['foo', 'bar'];
    // action
    const result = difference(array1, array2);
    // expect
    expect(result).toEqual(resultExpected);
  });

  it('should return the difference between array and string', () => {
    // setup
    const array = ['foo', 'bar', 'toto'];
    const string = 'toto';
    const resultExpected = ['foo', 'bar'];
    // action
    const result = difference(array, string);
    // expect
    expect(result).toEqual(resultExpected);
  });
});
