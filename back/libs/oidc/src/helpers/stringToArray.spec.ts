import { stringToArray } from './stringToArray';

describe('stringToArray', () => {
  it('should trim the values before splitting', () => {
    const input = '   one two three   ';
    const result = stringToArray(input);
    const expected = ['one', 'two', 'three'];
    expect(result).toEqual(expected);
  });

  it('should return a unique array if newSet is set to true', () => {
    const input = 'a a b b c c';
    const result = stringToArray(input);
    const expected = ['a', 'b', 'c'];
    expect(result).toEqual(expected);
  });

  it('should return array with only defined value', () => {
    const input = 'apple   banana   orange';
    const result = stringToArray(input);
    const expected = ['apple', 'banana', 'orange'];
    expect(result).toEqual(expected);
  });

  it('should return empty array if receive empty string', () => {
    const input = '';
    const result = stringToArray(input);
    const expected = [];
    expect(result).toEqual(expected);
  });
});
