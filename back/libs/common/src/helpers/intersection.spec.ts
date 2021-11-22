import { intersection } from './intersection';

describe('intersection', () => {
  it('should return the intersection between two array', () => {
    // setup
    const array1 = ['foo', 'bar', 'toto'];
    const array2 = ['toto', 'titi'];
    const resultExpected = ['toto'];
    // action
    const result = intersection(array1, array2);
    // expect
    expect(result).toEqual(resultExpected);
  });

  it('should return the intersection between array and string', () => {
    // setup
    const array = ['foo', 'bar', 'toto'];
    const string = 'toto';
    const resultExpected = ['toto'];
    // action
    const result = intersection(array, string);
    // expect
    expect(result).toEqual(resultExpected);
  });
});
