import { parseJsonProperty } from './parse-json-property';

describe('parseJsonProperty', () => {
  describe('value definition', () => {
    it('should throw TypeError if property does not exists', () => {
      // Given
      const input = { foo: 'bar' };
      const propertyName = 'wizz';
      // Then
      expect(() => parseJsonProperty(input, propertyName)).toThrow(TypeError);
    });
    it('should display property name and inputed object', () => {
      // Given
      const input = { foo: 'bar' };
      const propertyName = 'wizz';
      // Then
      expect(() => parseJsonProperty(input, propertyName)).toThrow(
        'property "wizz" does not exists on object: {"foo":"bar"}',
      );
    });
  });

  describe('parsing', () => {
    it('should throw TypeError if value is not valid JSON', () => {
      // Given
      const input = { foo: 'bar' };
      const propertyName = 'foo';
      // Then
      expect(() => parseJsonProperty(input, propertyName)).toThrow(TypeError);
    });
    it('should display property name and inputed object', () => {
      // Given
      const input = { foo: 'bar' };
      const propertyName = 'foo';
      // Then
      expect(() => parseJsonProperty(input, propertyName)).toThrow(
        'property "foo" is not JSON parsable, value was: bar',
      );
    });
  });
});
