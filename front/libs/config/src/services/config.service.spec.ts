import { NotYetInitialized, UnknownConfigurationNameError } from '../errors';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  describe('initialize', () => {
    describe('initialize appConfig', () => {
      beforeAll(() => {
        // @NOTE Disabled for testing purpose
        // eslint-disable-next-line @typescript-eslint/dot-notation
        ConfigService['appConfig'] = undefined;
      });

      it('should setup appConfig', () => {
        // When
        ConfigService.initialize({ key: 'current config' });

        // Then
        expect(ConfigService.get('key')).toBe('current config');
      });

      it('should not override appConfig', () => {
        // When
        ConfigService.initialize({ key: 'will not override current config' });

        // Then
        expect(ConfigService.get('key')).toBe('current config');
      });
    });

    describe('not been initialized', () => {
      beforeEach(() => {
        // @NOTE Disabled for testing purpose
        // eslint-disable-next-line @typescript-eslint/dot-notation
        ConfigService['appConfig'] = undefined;
      });

      it('should throw, if appConfig is not yet initialized', () => {
        // Then
        expect(() => {
          ConfigService.get('any.string');
        }).toThrow(NotYetInitialized);
      });
    });
  });

  describe('get', () => {
    describe('throwing', () => {
      beforeEach(() => {
        ConfigService.initialize({});
      });

      it('should throw, if name is not a config part', () => {
        // Then
        expect(() => {
          ConfigService.get('any.string');
        }).toThrow(UnknownConfigurationNameError);
      });

      it('should throw, if name is an empty string', () => {
        // Then
        expect(() => {
          ConfigService.get('');
        }).toThrow(UnknownConfigurationNameError);
      });

      it('should throw, if name is an empty whitespaced string', () => {
        // Then
        expect(() => {
          ConfigService.get('    ');
        }).toThrow(UnknownConfigurationNameError);
      });
    });

    describe('not throwing', () => {
      beforeEach(() => {
        // @NOTE Disabled for testing purpose
        // eslint-disable-next-line @typescript-eslint/dot-notation
        ConfigService['appConfig'] = undefined;
      });

      it('should not throw, if config part is defined', () => {
        // Given
        ConfigService.initialize({ foo: null });

        // Then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is null', () => {
        // Given
        ConfigService.initialize({ foo: null });

        // Then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is false', () => {
        // Given
        ConfigService.initialize({ foo: false });

        // Then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is an empty string', () => {
        // Given
        ConfigService.initialize({ foo: '' });

        // Then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is undefined', () => {
        // Given
        ConfigService.initialize({ foo: undefined });

        // Then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });
    });

    describe('returning', () => {
      beforeEach(() => {
        // @NOTE Disabled for testing purpose
        // eslint-disable-next-line @typescript-eslint/dot-notation
        ConfigService['appConfig'] = undefined;
      });

      it('should return an empty string', () => {
        // Given
        ConfigService.initialize({ foo: '' });

        // When
        const result = ConfigService.get('foo');

        // Then
        expect(result).toBe('');
      });

      it('should return false', () => {
        // Given
        ConfigService.initialize({ foo: false });

        // When
        const result = ConfigService.get('foo');

        // Then
        expect(result).toBeFalse();
      });

      it('should return the value', () => {
        // Given
        const symbol = Symbol('any symbol');
        ConfigService.initialize({ foo: symbol });

        // When
        const result = ConfigService.get('foo');

        // Then
        expect(result).toStrictEqual(symbol);
      });

      it('should return a value, if path is a sibling string', () => {
        // Given
        const symbol = Symbol('any symbol');
        ConfigService.initialize({ foo: { bar: { thevalue: symbol } } });

        // When
        const result = ConfigService.get('foo.bar.thevalue');

        // Then
        expect(result).toStrictEqual(symbol);
      });
    });
  });
});
