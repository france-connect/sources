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
        // when
        ConfigService.initialize({ key: 'current config' });
        // then
        expect(ConfigService.get('key')).toBe('current config');
      });

      it('should not override appConfig', () => {
        // when
        ConfigService.initialize({ key: 'will not override current config' });
        // then
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
        // then
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
        // then
        expect(() => {
          ConfigService.get('any.string');
        }).toThrow(UnknownConfigurationNameError);
      });

      it('should throw, if name is an empty string', () => {
        // then
        expect(() => {
          ConfigService.get('');
        }).toThrow(UnknownConfigurationNameError);
      });

      it('should throw, if name is an empty whitespaced string', () => {
        // then
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
        // given
        ConfigService.initialize({ foo: null });
        // then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is null', () => {
        // given
        ConfigService.initialize({ foo: null });
        // then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is false', () => {
        // given
        ConfigService.initialize({ foo: false });

        // then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is an empty string', () => {
        // given
        ConfigService.initialize({ foo: '' });

        // then
        expect(() => {
          ConfigService.get('foo');
        }).not.toThrow();
      });

      it('should not throw, if config part is undefined', () => {
        // given
        ConfigService.initialize({ foo: undefined });

        // then
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
        // given
        ConfigService.initialize({ foo: '' });

        // when
        const result = ConfigService.get('foo');

        // then
        expect(result).toBe('');
      });

      it('should return false', () => {
        // given
        ConfigService.initialize({ foo: false });

        // when
        const result = ConfigService.get('foo');

        // then
        expect(result).toBeFalse();
      });

      it('should return the value', () => {
        // given
        const symbol = Symbol('any symbol');
        ConfigService.initialize({ foo: symbol });

        // when
        const result = ConfigService.get('foo');

        // then
        expect(result).toStrictEqual(symbol);
      });

      it('should return a value, if path is a sibling string', () => {
        // given
        const symbol = Symbol('any symbol');
        ConfigService.initialize({ foo: { bar: { thevalue: symbol } } });

        // when
        const result = ConfigService.get('foo.bar.thevalue');

        // then
        expect(result).toStrictEqual(symbol);
      });
    });
  });
});
