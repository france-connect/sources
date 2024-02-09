import { ViewTemplateConflictingAliasException } from '../exceptions';
import { TemplateMethod } from './template-method.decorator';

describe('@TemplateMethod', () => {
  const aliasMock = 'aliasMock';

  it('should return a function', () => {
    // When
    const result = TemplateMethod(aliasMock);

    // Then
    expect(result).toBeInstanceOf(Function);
  });

  it('should add the method to the internal mapping', () => {
    // Given
    TemplateMethod.internalMapping = [];
    const decorator = TemplateMethod(aliasMock);
    const provider = {};
    const methodName = 'methodName';

    // When
    decorator(provider, methodName, {});

    // Then
    expect(TemplateMethod.internalMapping).toEqual([
      { alias: aliasMock, provider, methodName },
    ]);
  });

  it('should call checkConflictingAliasName()', () => {
    // Given
    const spy = jest.spyOn(TemplateMethod, 'checkConflictingAliasName');
    TemplateMethod.internalMapping = [];
    const decorator = TemplateMethod(aliasMock);
    const provider = {};
    const methodName = 'methodName';
    // When
    decorator(provider, methodName, {});

    // Then
    expect(spy).toHaveBeenCalledWith(aliasMock);
  });

  describe('checkConflictingAliasName', () => {
    it('should throw an error if the alias already exists', () => {
      // Given
      TemplateMethod.internalMapping = [
        { alias: aliasMock, provider: class Foo {}, methodName: 'methodName' },
      ];

      // Then / When
      expect(() => TemplateMethod.checkConflictingAliasName(aliasMock)).toThrow(
        ViewTemplateConflictingAliasException,
      );
    });

    it('should not throw an error if the alias does not exist', () => {
      // Given
      TemplateMethod.internalMapping = [];

      // When
      const result = () => TemplateMethod.checkConflictingAliasName(aliasMock);

      // Then
      expect(result).not.toThrowError();
    });
  });

  describe('getList', () => {
    it('should return the internal mapping', () => {
      // When
      const result = TemplateMethod.getList();

      // Then
      expect(result).toBe(TemplateMethod.internalMapping);
    });
  });
});
