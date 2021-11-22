import { IsNumber, IsObject } from 'class-validator';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from './config.service';
import { UnknownConfigurationNameError } from './errors';

class Schema {
  @IsNumber()
  readonly foo: number;

  @IsObject()
  readonly I: any;
}

describe('ConfigService', () => {
  let service: ConfigService;
  const options = {
    config: {
      I: {
        swear: {
          my: {
            intentions: {
              are: {
                bad: 'Harry',
              },
            },
          },
        },
      },
      foo: 42,
    },
    schema: Schema,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const configService = new ConfigService(options);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();
    service = module.get<ConfigService>(ConfigService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      // Then
      expect(service).toBeDefined();
    });
  });

  describe('validate', () => {
    it('should exit and give feed back if config is not valid', () => {
      // Given
      const config = {
        foo: 'a string instead of a number',
      };
      const processExit = jest
        .spyOn(process, 'exit')
        .mockImplementation((code) => code as never);
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation((log) => log);

      // When
      ConfigService['validate'](config, Schema);

      // Then
      expect(processExit).toHaveBeenCalledWith(1);
      expect(consoleError).toHaveBeenCalledTimes(3);
      expect(consoleError).toHaveBeenCalledWith('Invalid configuration Error');
      expect(consoleError).toHaveBeenCalledWith('Exiting app');
    });
  });

  describe('get', () => {
    it('should return asked part of config', () => {
      // Given
      const part = 'foo';
      // When
      const config = service.get(part);
      // Then
      expect(config).toBe(options.config.foo);
    });

    it('should return asked part of config based on dot paths', () => {
      //Given
      const paths = 'I.swear.my.intentions.are.bad';

      // When
      const config = service.get(paths);

      // Then
      expect(config).toBe('Harry');
    });

    it('should throw if path is not part of config', () => {
      // Given
      const part = 'bar';
      // Then
      expect(() => service.get(part)).toThrow(UnknownConfigurationNameError);
    });

    it('should throw if path is not a string', () => {
      // Given
      const part = 42;
      // Then
      expect(() => service.get(part as unknown as string)).toThrow(
        UnknownConfigurationNameError,
      );
    });

    it('should throw if path is undefined', () => {
      // Given
      const part = undefined;
      // Then
      expect(() => service.get(part)).toThrow(UnknownConfigurationNameError);
    });

    it('should throw if path is empty', () => {
      // Given
      const part = '';
      // Then
      expect(() => service.get(part)).toThrow(UnknownConfigurationNameError);
    });

    it("should throw if paths don't exist in config", () => {
      // Given
      const paths = 'I.swear.my.intentions.are.bad.harry.potter';

      // When
      // Then
      expect(() => service.get(paths)).toThrow(UnknownConfigurationNameError);
    });
  });
});
