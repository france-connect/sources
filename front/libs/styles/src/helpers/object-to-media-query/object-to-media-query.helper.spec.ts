import { objectToMediaQuery } from './object-to-media-query.helper';

describe('objectToMediaQuery', () => {
  it('should return an empty string if object is undefined', () => {
    // when
    const result = objectToMediaQuery(undefined);

    // then
    expect(result).toBe('');
  });

  it('should return an empty string if object has no keys', () => {
    // when
    const result = objectToMediaQuery({});

    // then
    expect(result).toBe('');
  });

  it('should return a string with a single media query', () => {
    // when
    // @NOTE CSS Properties
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const result = objectToMediaQuery({ 'min-width': '600px' });

    // then
    expect(result).toBe('(min-width:600px)');
  });

  it('should return a string with multiple media queries', () => {
    // when
    // @NOTE CSS Properties
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const result = objectToMediaQuery({ 'max-width': '350px', 'min-width': '600px' });

    // then
    expect(result).toBe('(max-width:350px) and (min-width:600px)');
  });

  it('should return a string with media queries when object keys are camel case', () => {
    // when
    // @NOTE CSS Properties

    const result = objectToMediaQuery({ maxWidth: '350px', minWidth: '600px' });

    // then
    expect(result).toBe('(max-width:350px) and (min-width:600px)');
  });

  it('should return a string with media queries when values are numbers', () => {
    // when
    // @NOTE CSS Properties

    const result = objectToMediaQuery({ maxWidth: 350, minWidth: 600 });

    // then
    expect(result).toBe('(max-width:350px) and (min-width:600px)');
  });
});
