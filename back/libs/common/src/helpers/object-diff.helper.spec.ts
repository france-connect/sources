import { objectDiff } from './object-diff.helper';

describe('objectDiff', () => {
  it('should return an empty array when both objects are empty', () => {
    const oldObj = {};
    const newObj = {};
    expect(objectDiff(oldObj, newObj)).toEqual([]);
  });

  it('should return an empty array when both objects are equal', () => {
    const oldObj = { a: 1, b: 'test' };
    const newObj = { a: 1, b: 'test' };
    expect(objectDiff(oldObj, newObj)).toEqual([]);
  });

  it('should return the keys of the properties that are different', () => {
    const oldObj = { a: 1, b: 'test', c: true };
    const newObj = { a: 2, b: 'test', c: false };
    expect(objectDiff(oldObj, newObj)).toEqual(['a', 'c']);
  });

  it('should return the keys of the properties that are different (deep equality)', () => {
    const oldObj = { a: { x: 1 }, b: 'test' };
    const newObj = { a: { x: 2 }, b: 'test' };
    expect(objectDiff(oldObj, newObj)).toEqual(['a']);
  });

  it('should return an empty array if array elements are the same in a different order', () => {
    const oldObj = { a: [1, 2, 3], b: 'test' };
    const newObj = { a: [3, 2, 1], b: 'test' };
    expect(objectDiff(oldObj, newObj, true)).toEqual([]);
  });

  it('should not detect array in different order in nested objects', () => {
    const oldObj = { a: { z: [1, 2, 3] }, b: 'test' };
    const newObj = { a: { z: [3, 2, 1] }, b: 'test' };
    expect(objectDiff(oldObj, newObj, true)).toEqual([]);
  });

  it('should detect diff in nested objects', () => {
    const oldObj = { a: { z: [1, 2, 3] }, b: 'test' };
    const newObj = { a: { z: [1, 2] }, b: 'test' };
    expect(objectDiff(oldObj, newObj, true)).toEqual(['a']);
  });
});
