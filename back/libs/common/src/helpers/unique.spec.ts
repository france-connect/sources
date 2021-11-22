import { unique } from './unique';

describe('unique', () => {
  it('should return an array with unique value', () => {
    // setup
    const array = ['foo', 'bar', 'toto', 'toto', 'titi', 'foo'];
    const resultExpected = ['foo', 'bar', 'toto', 'titi'];
    // action
    const result = unique(array);
    // expect
    expect(result).toEqual(resultExpected);
  });
});
