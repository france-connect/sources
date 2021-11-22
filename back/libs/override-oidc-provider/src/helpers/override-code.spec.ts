import { OverrideCode } from './override-code';

describe('OverrideCode', () => {
  it('should throw when trying to wrap unknown member', () => {
    // Given
    const foo = {};
    // Then
    expect(() => {
      // When
      OverrideCode.wrap(foo, 'bar', 'test');
    }).toThrow();
  });
  it('should throw when trying to access not wrapped original function', () => {
    // Given
    const unknownKey = 'foo';
    // Then
    expect(() => {
      OverrideCode.getOriginal(unknownKey);
    }).toThrow();
  });
  it('should wrap original function', () => {
    // Given
    const originalFunc = jest.fn().mockReturnValueOnce('bar return value');
    const foo = { bar: originalFunc };

    OverrideCode.wrap(foo, 'bar', 'barBackup');
    // When
    foo.bar();
    // Then
    expect(originalFunc).toHaveBeenCalledTimes(1);
  });
  it('should use original function name as store key if none provided', () => {
    // Given
    const originalFunc = jest.fn().mockReturnValueOnce('bar return value');
    const foo = { bar: originalFunc };
    const overrideResponse = Symbol('override return value');
    const overrideFunc = jest.fn().mockReturnValueOnce(overrideResponse);
    OverrideCode.wrap(foo, 'bar');
    // When
    OverrideCode.override('bar', overrideFunc);
    const result = foo.bar();
    // Then
    expect(result).toBe(overrideResponse);
  });
  it('should return value of override function', () => {
    // Given
    const barResponse = Symbol('bar return response');
    const overrideResponse = Symbol('override return value');
    const originalFunc = jest.fn().mockReturnValueOnce(barResponse);
    const overrideFunc = jest.fn().mockReturnValueOnce(overrideResponse);
    const foo = { bar: originalFunc };

    OverrideCode.wrap(foo, 'bar', 'foo.bar');
    OverrideCode.override('foo.bar', overrideFunc);
    // When
    const result = foo.bar();
    // Then
    expect(result).toBe(overrideResponse);
  });
  it('should allow to call original function inside override', () => {
    // Given
    const originalFunc = jest.fn().mockReturnValueOnce('bar return value');
    const overrideFunc = () => {
      const originalFromOverride = OverrideCode.getOriginal('foo.bar');

      originalFromOverride();

      return 'override return value';
    };
    const foo = { bar: originalFunc };

    OverrideCode.wrap(foo, 'bar', 'foo.bar');
    OverrideCode.override('foo.bar', overrideFunc);
    // When
    const result = foo.bar();
    // Then
    expect(originalFunc).toHaveBeenCalledTimes(1);
    expect(result).toBe('override return value');
  });
  it('should pass arguments as expected in original function in default wrapper', () => {
    // Given
    const originalFunc = jest.fn().mockReturnValueOnce('bar return value');
    const foo = { bar: originalFunc };

    OverrideCode.wrap(foo, 'bar', 'foo.bar');
    // When
    foo.bar('a', 'b', 'c');
    // Then
    expect(originalFunc).toHaveBeenCalledWith('a', 'b', 'c');
  });
  it('should pass arguments as expected in original function', () => {
    // Given
    const originalFunc = jest
      .fn()
      .mockReturnValueOnce('bar return value in custom override');

    const overrideFunc = (a, b, c) => {
      const originalFromOverride = OverrideCode.getOriginal('foo.bar');

      originalFromOverride(a, b, c);

      return 'override return value';
    };
    const foo = { bar: originalFunc };

    OverrideCode.wrap(foo, 'bar', 'foo.bar');
    OverrideCode.override('foo.bar', overrideFunc);
    // When
    foo.bar('a', 'b', 'c');
    // Then
    expect(originalFunc).toHaveBeenCalledWith('a', 'b', 'c');
  });
});
