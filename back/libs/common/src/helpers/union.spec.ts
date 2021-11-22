import { union } from './union';

describe('union', () => {
  it('should return the union between two array', () => {
    // setup
    const array1 = ['foo', 'bar', 'toto'];
    const array2 = ['toto', 'titi'];
    const resultExpected = ['foo', 'bar', 'toto', 'toto', 'titi'];
    // action
    const result = union(array1, array2);
    // expect
    expect(result).toEqual(resultExpected);
  });
});
