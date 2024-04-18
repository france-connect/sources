import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { I18nInvalidOrMissingCountVariableException } from '../exceptions';
import { I18nKeyNotFoundException } from '../exceptions/i18n-key-not-found.exception';
import { I18nMissingVariableException } from '../exceptions/i18n-missing-variable.exception';
import { I18nTranslateOptionsInterface } from '../interfaces';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  const configMock = getConfigMock();
  const sessionMock = getSessionServiceMock();
  const loggerMock = getLoggerMock();

  const translations = {
    'fr-FR': {
      hello: 'Bonjour',
      world: 'Monde',
    },
    'en-GB': {
      hello: 'Hello',
      world: 'World',
    },
  };

  const options = {};

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [I18nService, ConfigService, SessionService, LoggerService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(SessionService)
      .useValue(sessionMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<I18nService>(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('translate', () => {
    // Given
    const replaceVariablesResult = 'replaceVariablesResult';
    const input = 'hello';
    const variables = { foo: 'bar' };
    const complexTranslation = {
      term: 'count',
      definition: { one: 'one', other: 'other' },
    };

    beforeEach(() => {
      service['getTranslations'] = jest
        .fn()
        .mockReturnValue(translations['fr-FR']);
      service['replaceVariables'] = jest
        .fn()
        .mockReturnValue(replaceVariablesResult);
    });

    it('should call getTranslations', () => {
      // When
      service.translate(input);

      // Then
      expect(service['getTranslations']).toHaveBeenCalledExactlyOnceWith({});
    });

    it('should forward options to getTranslations', () => {
      // Given
      const optionMock = Symbol(
        'options',
      ) as unknown as I18nTranslateOptionsInterface;
      // When
      service.translate(input, null, optionMock);

      // Then
      expect(service['getTranslations']).toHaveBeenCalledExactlyOnceWith(
        optionMock,
      );
    });

    it('should throw if the provided key has no translation', () => {
      // Given
      const input = 'missing_key';

      // When / Then
      expect(() => service.translate(input)).toThrow(I18nKeyNotFoundException);
    });

    it('should replace placeholders by variables values', () => {
      // Given
      service['getTranslations'] = jest.fn().mockReturnValueOnce({
        [input]: complexTranslation,
      });

      // When
      service.translate(input, variables);

      // Then
      expect(service['replaceVariables']).toHaveBeenCalledExactlyOnceWith(
        complexTranslation,
        variables,
        options,
      );
    });

    it('should forward options to replaceVariables', () => {
      // Given
      service['getTranslations'] = jest.fn().mockReturnValueOnce({
        [input]: complexTranslation,
      });
      const optionMock = Symbol(
        'options',
      ) as unknown as I18nTranslateOptionsInterface;
      // When
      service.translate(input, variables, optionMock);

      // Then
      expect(service['replaceVariables']).toHaveBeenCalledExactlyOnceWith(
        complexTranslation,
        variables,
        optionMock,
      );
    });

    it('should return result from replaceVariables', () => {
      // Given
      service['getTranslations'] = jest.fn().mockReturnValueOnce({
        [input]: complexTranslation,
      });

      // When
      const result = service.translate(input, variables);

      // Then
      expect(result).toBe(replaceVariablesResult);
    });
  });

  describe('setSessionLanguage', () => {
    it('should call set the language for this session', () => {
      // Given
      const language = 'fr-FR';

      // When
      service.setSessionLanguage(language);

      // Then
      expect(sessionMock.set).toHaveBeenCalledExactlyOnceWith('I18n', {
        language,
      });
    });
  });

  describe('getTranslations', () => {
    beforeEach(() => {
      sessionMock.get.mockReturnValue({ language: 'en-GB' });
      configMock.get.mockReturnValue({ translations });
    });

    it('should retrieve the session for I18n', () => {
      // When
      service['getTranslations'](options);

      // Then
      expect(sessionMock.get).toHaveBeenCalledExactlyOnceWith('I18n');
    });

    it('should  retrieve the config for I18n', () => {
      // When
      service['getTranslations'](options);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('I18n');
    });

    it('should return the translations for the current language', () => {
      // When
      const result = service['getTranslations'](options);

      // Then
      expect(result).toBe(translations['en-GB']);
    });

    it('should return the translations for language given as options', () => {
      // Given
      const optionsMock = { language: 'fr-FR' };
      // When
      const result = service['getTranslations'](optionsMock);

      // Then
      expect(result).toBe(translations['fr-FR']);
    });

    it('should fall back to the default language if no session language is found and no language is given as option', () => {
      // Given
      sessionMock.get.mockReturnValueOnce(undefined);

      const configDefaultLanguage = Symbol('defaultLanguage');
      const defaultTranslations = Symbol('defaultTranslations');

      configMock.get
        .mockReturnValueOnce({
          defaultLanguage: configDefaultLanguage,
        })
        .mockReturnValueOnce({
          translations: {
            [configDefaultLanguage]: defaultTranslations,
          },
        });

      // When
      const result = service['getTranslations'](options);

      // Then
      expect(result).toBe(defaultTranslations);
    });
  });

  describe('replaceVariables', () => {
    // Given
    const complexInput = {
      term: 'count',
      definition: { one: 'one', other: 'other' },
    };
    const variables = { count: 2 };
    const getPluralDefinitionResult = 'getPluralDefinitionResult';

    beforeEach(() => {
      service['getPluralDefinition'] = jest
        .fn()
        .mockReturnValue(getPluralDefinitionResult);
    });

    it('should return the input if it is a string', () => {
      // Given
      const input = 'hello';

      // When
      const result = service['replaceVariables'](input, {}, options);

      // Then
      expect(result).toBe(input);
    });

    it('should call getPluralDefinition if the input is not a string', () => {
      // When
      service['replaceVariables'](complexInput, variables, options);

      // Then
      expect(service['getPluralDefinition']).toHaveBeenCalledExactlyOnceWith(
        complexInput,
        variables,
      );
    });

    it('should return result from getPluralDefinition', () => {
      // When
      const output = service['replaceVariables'](
        complexInput,
        variables,
        options,
      );

      // Then
      expect(output).toBe(getPluralDefinitionResult);
    });

    it('should replace variables in the input', () => {
      // Given
      const input = 'hello {name}';
      const variables = { name: 'world' };

      // When
      const result = service['replaceVariables'](input, variables, options);

      // Then
      expect(result).toBe('hello world');
    });
  });

  describe('getPluralDefinition', () => {
    it('should throw if no variables were passed as parameter', () => {
      // Given
      const input = {
        term: 'count',
        definition: { one: 'one', other: 'other' },
      };
      const variables = undefined;

      // When / Then
      expect(() => service['getPluralDefinition'](input, variables)).toThrow(
        I18nMissingVariableException,
      );

      // When / Then
      expect(() => service['getPluralDefinition'](input, variables)).toThrow(
        I18nMissingVariableException,
      );
    });

    it('should throw if the count variable is not a number', () => {
      // Given
      const input = {
        term: 'count',
        definition: { one: 'one', other: 'other' },
      };
      const variables = { count: 'not a number' };

      // When / Then
      expect(() => service['getPluralDefinition'](input, variables)).toThrow(
        I18nInvalidOrMissingCountVariableException,
      );
    });

    it('should throw if the count variable is not defined', () => {
      // Given
      const input = {
        term: 'count',
        definition: { one: 'one', other: 'other' },
      };
      const variables = { notCount: 42 };

      // When / Then
      expect(() => service['getPluralDefinition'](input, variables)).toThrow(
        I18nInvalidOrMissingCountVariableException,
      );
    });

    describe('when count is 0', () => {
      it('should return def.zero if zero is defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { zero: 'zero', other: 'other' },
        };
        const variables = { count: 0 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('zero');
      });

      it('should return def.other if zero is not defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { many: 'many', other: 'other' },
        };
        const variables = { count: 0 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('other');
      });
    });

    describe('when count is 1', () => {
      it('should return def.one if one is defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { one: 'one', other: 'other' },
        };
        const variables = { count: 1 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('one');
      });

      it('should return def.few if one is not defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { few: 'few', other: 'other' },
        };
        const variables = { count: 1 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('few');
      });

      it('should return def.other if one and few are not defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { many: 'many', other: 'other' },
        };
        const variables = { count: 1 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('other');
      });
    });

    describe('when count is 2', () => {
      it('should return def.two if two is defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { two: 'two', other: 'other' },
        };
        const variables = { count: 2 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('two');
      });

      it('should return def.few if two is not defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { few: 'few', other: 'other' },
        };
        const variables = { count: 2 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('few');
      });

      it('should return def.other if two and few are not defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { many: 'many', other: 'other' },
        };
        const variables = { count: 2 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('other');
      });
    });

    describe('when count is between 3 and 6', () => {
      it('should return def.few if few is defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { few: 'few', other: 'other' },
        };
        const variables = { count: 3 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('few');
      });

      it('should return def.other if few is not defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { many: 'many', other: 'other' },
        };
        const variables = { count: 3 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('other');
      });
    });

    describe('when count is greater than 6', () => {
      it('should return def.many if many is defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { many: 'many', other: 'other' },
        };
        const variables = { count: 7 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('many');
      });

      it('should return def.other if many is not defined', () => {
        // Given
        const input = {
          term: 'count',
          definition: { other: 'other' },
        };
        const variables = { count: 7 };

        // When
        const result = service['getPluralDefinition'](input, variables);

        // Then
        expect(result).toBe('other');
      });
    });
  });

  describe('getVariable', () => {
    it('should escape variables if escapeVariables option is true', () => {
      // Given
      const value = '<script>alert("hello")</script>';
      const options = { escapeVariables: true };

      // When
      const result = service['getVariable'](value, options);

      // Then
      expect(result).toBe('&lt;script&gt;alert(&34;hello&34;)&lt;/script&gt;');
    });

    it('should return the value as string if escapeVariables option is false', () => {
      // Given
      const value = 42;
      const options = { escapeVariables: false };

      // When
      const result = service['getVariable'](value, options);

      // Then
      expect(result).toBe('42');
    });
  });
});
