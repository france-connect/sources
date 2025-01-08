import { objectToMediaQuery } from './object-to-media-query.helper';

describe('objectToMediaQuery', () => {
  it('should return an empty string if object is undefined', () => {
    // When
    const result = objectToMediaQuery(undefined);

    // Then
    expect(result).toBe('');
  });

  it('should return an empty string if object has no keys', () => {
    // When
    const result = objectToMediaQuery({});

    // Then
    expect(result).toBe('');
  });

  it('should return a string with a single media query', () => {
    // When
    // @NOTE CSS Properties
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const result = objectToMediaQuery({ 'min-width': '600px' });

    // Then
    expect(result).toBe('(min-width:600px)');
  });

  it('should return a string with multiple media queries', () => {
    // When
    // @NOTE CSS Properties
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const result = objectToMediaQuery({ 'max-width': '350px', 'min-width': '600px' });

    // Then
    expect(result).toBe('(max-width:350px) and (min-width:600px)');
  });

  it('should return a string with media queries when object keys are camel case', () => {
    // When
    // @NOTE CSS Properties

    const result = objectToMediaQuery({ maxWidth: '350px', minWidth: '600px' });

    // Then
    expect(result).toBe('(max-width:350px) and (min-width:600px)');
  });

  it('should return a string with media queries when values are numbers', () => {
    // When
    // @NOTE CSS Properties

    const result = objectToMediaQuery({ maxWidth: 350, minWidth: 600 });

    // Then
    expect(result).toBe('(max-width:350px) and (min-width:600px)');
  });
});
