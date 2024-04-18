import { overrideWithSourceIfNotNull } from './override-with-source-if-not-null'; // Assurez-vous de remplacer 'your-file' par le chemin correct de votre fichier

describe('overrideWithSourceIfNotNull()', () => {
  it('should return an object merged with existing keys when both input objects have values', () => {
    // given
    const destValue = { a: 1, b: 2 };
    const srcValue = { b: 3, c: 4 };

    // when
    const result = overrideWithSourceIfNotNull(destValue, srcValue);

    // then
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should return an object merged with keys defined if there are defined null into srcValue', () => {
    // given
    const destValue = { a: 1, b: 2 };
    const srcValue = { b: null, c: 4 };

    // when
    const result = overrideWithSourceIfNotNull(destValue, srcValue);

    // then
    expect(result).toEqual({ a: 1, b: 2, c: 4 });
  });

  it('should return the original object when the source value is null', () => {
    // given
    const destValue = { a: 1, b: 2 };
    const srcValue = null;

    // when
    const result = overrideWithSourceIfNotNull(destValue, srcValue);

    // then
    expect(result).toEqual(destValue);
  });

  it('should return the source value when the object value is null', () => {
    // given
    const destValue = null;
    const srcValue = { a: 1, b: 2 };

    // when
    const result = overrideWithSourceIfNotNull(destValue, srcValue);

    // then
    expect(result).toEqual(srcValue);
  });

  it('should return an empty object when both input objects are null', () => {
    // given
    const destValue = null;
    const srcValue = null;

    // when
    const result = overrideWithSourceIfNotNull(destValue, srcValue);

    // then
    expect(result).toEqual({});
  });
});
