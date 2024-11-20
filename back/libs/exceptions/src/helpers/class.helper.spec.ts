import { BaseException } from '../exceptions';
import { getClass } from './class.helper';

describe('getClass', () => {
  class ClassMock extends BaseException {}

  it('should return class name', () => {
    // Given
    const instance = new ClassMock();

    // When
    const result = getClass(instance);

    // Then
    expect(result).toBe(ClassMock);
  });
});
