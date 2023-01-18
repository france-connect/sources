import { I18nServiceNotInitializedExceptions, I18nTranslationNotFound } from '../exceptions';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  const translationMappingMock = {
    keyWithFullDefinition: {
      definition: {
        few: 'keyWithFullDefinition few',
        many: 'keyWithFullDefinition many {param1}',
        one: 'keyWithFullDefinition one',
        other: 'keyWithFullDefinition other',
        two: 'keyWithFullDefinition two',
        zero: 'keyWithFullDefinition zero',
      },
      term: 'countProperty',
    },
    keyWithSomeDefinition: {
      definition: {
        few: 'keyWithSomeDefinition few',
        other: 'keyWithSomeDefinition other',
      },
      term: 'keyWithSomeDefinition',
    },
    keyWithString: 'keyWithString translation',
  };

  const localeMock = 'fr-FR';

  describe('instance', () => {
    it('should throw if used before initialisation', () => {
      // When / Then
      expect(() => I18nService.instance()).toThrow(I18nServiceNotInitializedExceptions);
    });

    it('should return same instance each time', () => {
      // Given
      I18nService.initialize(localeMock, translationMappingMock);

      // When
      const result1 = I18nService.instance();
      const result2 = I18nService.instance();

      // Then
      expect(result1).toBeInstanceOf(I18nService);
      expect(result1).toBe<I18nService>(result2);
    });
  });

  describe('initialize', () => {
    it('should set locale', () => {
      // When
      I18nService.initialize(localeMock, translationMappingMock);

      // Then
      expect(I18nService.instance()['locale']).toBe(localeMock);
    });

    it('should set translations', () => {
      // When
      I18nService.initialize(localeMock, translationMappingMock);

      // Then
      expect(I18nService.instance()['translations']).toBe(translationMappingMock);
    });
  });

  describe('translate', () => {
    let service: I18nService;
    beforeEach(() => {
      I18nService.initialize(localeMock, translationMappingMock);
      service = I18nService.instance();
    });

    it('should throw if translation is not in map', () => {
      // Given
      const keyMock = 'nonExistingKey';

      // When / Then
      expect(() => I18nService.instance().translate(keyMock)).toThrow(I18nTranslationNotFound);
    });

    it('should return simple translation', () => {
      // Given
      const keyMock = 'keyWithString';

      // When
      const result = I18nService.instance().translate(keyMock);

      // Then
      expect(result).toEqual('keyWithString translation');
    });

    it('should call handlePlural()', () => {
      // Given
      const keyMock = 'keyWithSomeDefinition';
      service['handlePlural'] = jest.fn();

      // When
      service.translate(keyMock);

      // Then
      expect(service['handlePlural']).toHaveBeenCalledTimes(1);
      expect(service['handlePlural']).toHaveBeenCalledWith(
        translationMappingMock.keyWithSomeDefinition,
        expect.any(Object),
      );
    });

    it('should call handleSubstitution()', () => {
      // Given
      const keyMock = 'keyWithSomeDefinition';
      const valuesMock = { params1: 'param1 Value' };
      const handlePluralMockReturnValue = Symbol('handlePluralMockReturnValue');
      service['handlePlural'] = jest.fn().mockReturnValue(handlePluralMockReturnValue);
      service['handleSubstitution'] = jest.fn();

      // When
      service.translate(keyMock, valuesMock);

      // Then
      expect(service['handleSubstitution']).toHaveBeenCalledTimes(1);
      expect(service['handleSubstitution']).toHaveBeenCalledWith(
        handlePluralMockReturnValue,
        valuesMock,
      );
    });

    it('should return result of call to handleSubstitution()', () => {
      // Given
      const keyMock = 'keyWithSomeDefinition';
      const valuesMock = { params1: 'param1 Value' };
      const handleSubstitutionMockedResult = 'handleSubstitutionMockedResult';
      service['handleSubstitution'] = jest.fn().mockReturnValue(handleSubstitutionMockedResult);

      // When
      const result = service.translate(keyMock, valuesMock);

      // Then
      expect(result).toBe(handleSubstitutionMockedResult);
    });

    it('should return the key if values are required but not passed', () => {
      // Given
      const keyMock = 'keyWithSomeDefinition';
      const valuesMock = { params1: 'param1 Value' };
      const handleSubstitutionMockedResult = 'handleSubstitutionMockedResult';
      service['handleSubstitution'] = jest.fn().mockReturnValue(handleSubstitutionMockedResult);

      // When
      const result = service.translate(keyMock, valuesMock);

      // Then
      expect(result).toBe(handleSubstitutionMockedResult);
    });
  });

  describe('handlePlural - general cases', () => {
    let service: I18nService;
    beforeEach(() => {
      I18nService.initialize(localeMock, translationMappingMock);
      service = I18nService.instance();
    });

    it('should return input unchanged if input is a string', () => {
      // Given
      const inputMock = 'inputMock';
      const valuesMock = {};

      // When
      const result = service['handlePlural'](inputMock, valuesMock);

      // Then
      expect(result).toBe(inputMock);
    });

    it('should return the value of the `zero` definition part', () => {
      // Given
      const valuesMock = {
        countProperty: 0,
      };
      const inputMock = translationMappingMock.keyWithFullDefinition;

      // When
      const result = service['handlePlural'](inputMock, valuesMock);

      // Then
      expect(result).toBe(translationMappingMock.keyWithFullDefinition.definition.zero);
    });

    it('should return the value of the `one` definition part', () => {
      // Given
      const valuesMock = {
        countProperty: 1,
      };
      const inputMock = translationMappingMock.keyWithFullDefinition;

      // When
      const result = service['handlePlural'](inputMock, valuesMock);

      // Then
      expect(result).toBe(translationMappingMock.keyWithFullDefinition.definition.one);
    });

    it('should return the value of the `two` definition part', () => {
      // Given
      const valuesMock = {
        countProperty: 2,
      };
      const inputMock = translationMappingMock.keyWithFullDefinition;

      // When
      const result = service['handlePlural'](inputMock, valuesMock);

      // Then
      expect(result).toBe(translationMappingMock.keyWithFullDefinition.definition.two);
    });

    it('should return the value of the `few` definition part', () => {
      // Given
      const valuesMock = {
        countProperty: 3,
      };
      const inputMock = translationMappingMock.keyWithFullDefinition;

      // When
      const result = service['handlePlural'](inputMock, valuesMock);

      // Then
      expect(result).toBe(translationMappingMock.keyWithFullDefinition.definition.few);
    });

    it('should return the value of the `many` definition part', () => {
      // Given
      const valuesMock = {
        countProperty: 7,
      };
      const inputMock = translationMappingMock.keyWithFullDefinition;

      // When
      const result = service['handlePlural'](inputMock, valuesMock);

      // Then
      expect(result).toBe(translationMappingMock.keyWithFullDefinition.definition.many);
    });

    it('should return the value of the `other` definition part', () => {
      // Given
      const valuesMock = {
        countProperty: -2,
      };
      const inputMock = translationMappingMock.keyWithFullDefinition;

      // When
      const result = service['handlePlural'](inputMock, valuesMock);

      // Then
      expect(result).toBe(translationMappingMock.keyWithFullDefinition.definition.other);
    });
  });

  describe('handlePlural - fallback cases', () => {
    it('should fallback to value of the `other` definition if `zero` is not defined', () => {
      // Given
      const mapMock = {
        inputMock: {
          definition: {
            other: 'other value',
          },
          term: 'countProperty',
        },
      };
      const valuesMock = {
        countProperty: 0,
      };
      I18nService.initialize(localeMock, mapMock);
      const service = I18nService.instance();

      // When
      const result = service['handlePlural'](mapMock.inputMock, valuesMock);

      // Then
      expect(result).toBe(mapMock.inputMock.definition.other);
    });

    it('should fallback to value of the `few` definition if `one` is not defined', () => {
      // Given
      const mapMock = {
        inputMock: {
          definition: {
            few: 'few value',
            other: 'other value',
          },
          term: 'countProperty',
        },
      };
      const valuesMock = {
        countProperty: 1,
      };
      I18nService.initialize(localeMock, mapMock);
      const service = I18nService.instance();

      // When
      const result = service['handlePlural'](mapMock.inputMock, valuesMock);

      // Then
      expect(result).toBe(mapMock.inputMock.definition.few);
    });

    it('should fallback to value of the `other` definition if `one` and `few` are not defined', () => {
      // Given
      const mapMock = {
        inputMock: {
          definition: {
            other: 'other value',
          },
          term: 'countProperty',
        },
      };
      const valuesMock = {
        countProperty: 1,
      };
      I18nService.initialize(localeMock, mapMock);
      const service = I18nService.instance();

      // When
      const result = service['handlePlural'](mapMock.inputMock, valuesMock);

      // Then
      expect(result).toBe(mapMock.inputMock.definition.other);
    });

    it('should fallback to value of the `few` definition if `two` is not defined', () => {
      // Given
      const mapMock = {
        inputMock: {
          definition: {
            few: 'few value',
            other: 'other value',
          },
          term: 'countProperty',
        },
      };
      const valuesMock = {
        countProperty: 2,
      };
      I18nService.initialize(localeMock, mapMock);
      const service = I18nService.instance();

      // When
      const result = service['handlePlural'](mapMock.inputMock, valuesMock);

      // Then
      expect(result).toBe(mapMock.inputMock.definition.few);
    });

    it('should fallback to value of the `other` definition if `two` and `few` are not defined', () => {
      // Given
      const mapMock = {
        inputMock: {
          definition: {
            other: 'other value',
          },
          term: 'countProperty',
        },
      };
      const valuesMock = {
        countProperty: 2,
      };
      I18nService.initialize(localeMock, mapMock);
      const service = I18nService.instance();

      // When
      const result = service['handlePlural'](mapMock.inputMock, valuesMock);

      // Then
      expect(result).toBe(mapMock.inputMock.definition.other);
    });

    it('should fallback to value of the `other` definition if `few` is not defined', () => {
      // Given
      const mapMock = {
        inputMock: {
          definition: {
            other: 'other value',
          },
          term: 'countProperty',
        },
      };
      const valuesMock = {
        countProperty: 3,
      };
      I18nService.initialize(localeMock, mapMock);
      const service = I18nService.instance();

      // When
      const result = service['handlePlural'](mapMock.inputMock, valuesMock);

      // Then
      expect(result).toBe(mapMock.inputMock.definition.other);
    });

    it('should fallback to value of the `other` definition if `many` is not defined', () => {
      // Given
      const mapMock = {
        inputMock: {
          definition: {
            other: 'other value',
          },
          term: 'countProperty',
        },
      };
      const valuesMock = {
        countProperty: 7,
      };
      I18nService.initialize(localeMock, mapMock);
      const service = I18nService.instance();

      // When
      const result = service['handlePlural'](mapMock.inputMock, valuesMock);

      // Then
      expect(result).toBe(mapMock.inputMock.definition.other);
    });
  });

  describe('handleSubstitution', () => {
    let service: I18nService;
    beforeEach(() => {
      I18nService.initialize(localeMock, translationMappingMock);
      service = I18nService.instance();
    });

    it('should return the input unchanged', () => {
      // Given
      const inputMock = 'inputMockValue';
      const valuesMock = {};

      // When
      const result = service['handleSubstitution'](inputMock, valuesMock);

      // Then
      expect(result).toBe(inputMock);
    });

    it('should return the input with one substitution', () => {
      // Given
      const inputMock = 'inputMockValue {var1} more text';
      const valuesMock = { var1: 'var1Value' };

      // When
      const result = service['handleSubstitution'](inputMock, valuesMock);

      // Then
      expect(result).toEqual('inputMockValue var1Value more text');
    });

    it('should return the input with several substitutions', () => {
      // Given
      const inputMock = 'inputMockValue {var1} more text {var2} and even more text';
      const valuesMock = { var1: 'var1Value', var2: 'var2Value' };

      // When
      const result = service['handleSubstitution'](inputMock, valuesMock);

      // Then
      expect(result).toEqual('inputMockValue var1Value more text var2Value and even more text');
    });

    it('should return the input with several substitutions for the same var and discard unused vars', () => {
      // Given
      const inputMock = 'inputMockValue {var1} more text {var1} and even more text';
      const valuesMock = { var1: 'var1Value', var2: 'var2Value' };

      // When
      const result = service['handleSubstitution'](inputMock, valuesMock);

      // Then
      expect(result).toEqual('inputMockValue var1Value more text var1Value and even more text');
    });
  });
});
