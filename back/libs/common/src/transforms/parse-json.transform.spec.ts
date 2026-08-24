import { TransformFnParams } from 'class-transformer';

import { parseJson, parseJsonAs } from './parse-json.transform';

describe('parseJson', () => {
  it('should parse a valid JSON string into an object', () => {
    // Given
    const params = { value: '{"foo":"bar"}' } as TransformFnParams;

    // When
    const result = parseJson(params);

    // Then
    expect(result).toEqual({ foo: 'bar' });
  });

  it('should parse a valid JSON string into an array', () => {
    // Given
    const params = { value: '[1,2,3]' } as TransformFnParams;

    // When
    const result = parseJson(params);

    // Then
    expect(result).toEqual([1, 2, 3]);
  });

  it('should return the original string when JSON is malformed', () => {
    // Given
    const params = { value: 'not-json' } as TransformFnParams;

    // When
    const result = parseJson(params);

    // Then
    expect(result).toBe('not-json');
  });

  it('should return the value as-is when it is already an object', () => {
    // Given
    const obj = { foo: 'bar' };
    const params = { value: obj } as TransformFnParams;

    // When
    const result = parseJson(params);

    // Then
    expect(result).toBe(obj);
  });

  it('should return the value as-is when it is a number', () => {
    // Given
    const params = { value: 42 } as TransformFnParams;

    // When
    const result = parseJson(params);

    // Then
    expect(result).toBe(42);
  });

  it('should return the value as-is when it is undefined', () => {
    // Given
    const params = { value: undefined } as TransformFnParams;

    // When
    const result = parseJson(params);

    // Then
    expect(result).toBeUndefined();
  });
});

describe('parseJsonAs', () => {
  class TestClass {
    foo: string;
    bar: number;
  }

  it('should parse a valid JSON string and instantiate it as an instance of the provided class', () => {
    // Given
    const params = { value: '{"foo":"test","bar":42}' } as TransformFnParams;
    const transformFn = parseJsonAs(TestClass);

    // When
    const result = transformFn(params);

    // Then
    expect(result).toBeInstanceOf(TestClass);
    expect((result as TestClass).foo).toBe('test');
    expect((result as TestClass).bar).toBe(42);
  });

  it('should return the original string when JSON is malformed', () => {
    // Given
    const params = { value: 'not-json' } as TransformFnParams;
    const transformFn = parseJsonAs(TestClass);

    // When
    const result = transformFn(params);

    // Then
    expect(result).toBe('not-json');
  });

  it('should return the JSON structure as an instance of the class when it is a valid object and string', () => {
    // Given
    const obj = { foo: 'test', bar: 42 };
    const params = { value: JSON.stringify(obj) } as TransformFnParams;
    const transformFn = parseJsonAs(TestClass);

    // When
    const result = transformFn(params);

    // Then
    expect(result).toMatchObject(obj);
    expect(result).toBeInstanceOf(TestClass);
  });

  it('should return the value as an instance of the class when it is already an object', () => {
    // Given
    const obj = { foo: 'test', bar: 42 };
    const params = { value: obj } as TransformFnParams;
    const transformFn = parseJsonAs(TestClass);

    // When
    const result = transformFn(params);

    // Then
    expect(result).toMatchObject(obj);
    expect(result).toBeInstanceOf(TestClass);
  });

  it('should return the value as-is when it is a number', () => {
    // Given
    const params = { value: 42 } as TransformFnParams;
    const transformFn = parseJsonAs(TestClass);

    // When
    const result = transformFn(params);

    // Then
    expect(result).toBe(42);
  });

  it('should return the value as-is when it is undefined', () => {
    // Given
    const params = { value: undefined } as TransformFnParams;
    const transformFn = parseJsonAs(TestClass);

    // When
    const result = transformFn(params);

    // Then
    expect(result).toBeUndefined();
  });
});
