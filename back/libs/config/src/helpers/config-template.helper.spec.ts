import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '../config.service';
import { ConfigTemplateHelper } from './config-template.helper';

describe('ConfigTemplateHelper', () => {
  let helper: ConfigTemplateHelper;

  const AppMock = { foo: true, bar: true };

  const configMock = {
    templateExposed: { App: AppMock },
    spId: 'mockSpId',
    spName: 'mockSpName',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const keyMock = 'someKey';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigTemplateHelper, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    helper = module.get<ConfigTemplateHelper>(ConfigTemplateHelper);

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(helper).toBeDefined();
  });

  describe('get()', () => {
    // Given
    const getConfigPartsMockedReturn = {
      [keyMock]: Symbol('getConfigPart'),
    };
    beforeEach(() => {
      helper['getConfigParts'] = jest
        .fn()
        .mockReturnValueOnce(getConfigPartsMockedReturn);
    });

    it('should call getConfigParts with configuration for templateExposed', () => {
      // When
      helper.get(keyMock);

      // Then
      expect(helper['getConfigParts']).toHaveBeenCalledTimes(1);
      expect(helper['getConfigParts']).toHaveBeenCalledWith(
        configMock.templateExposed,
      );
    });

    it('should return value from call to getConfigParts()', () => {
      const result = helper.get(keyMock);
      // Then
      expect(result).toBeDefined();
      expect(result).toBe(getConfigPartsMockedReturn[keyMock]);
    });

    it('should return undefined if there is not configured templateExposed', () => {
      // Given
      configServiceMock.get.mockReset().mockReturnValueOnce({});
      const result = helper.get(keyMock);
      // Then
      expect(result).not.toBeDefined();
    });
  });

  describe('fillObject', () => {
    it('should return partial object', () => {
      // Given
      const source = {
        bar: 'barValue',
        baz: 'bazValue',
        buzz: 'buzzValue',
        wizz: 'wizzValue',
      };
      const target = { bar: true, wizz: true };

      // When
      const result = helper['fillObject'](target, source);
      // Then
      expect(result).toEqual({ bar: 'barValue', wizz: 'wizzValue' });
    });
  });

  describe('getConfigParts()', () => {
    // Given
    it('should return values from config excluding non listed properties', async () => {
      // Given
      const parts = {
        App: { spName: true },
      };
      // When
      const result = await helper['getConfigParts'](parts);
      // Then
      expect(result).toEqual({
        App: {
          spName: configMock.spName,
        },
      });
    });

    it('should return values from config even from multiple config sections', async () => {
      // Given
      const parts = {
        Fizz: { buzz: true },
        Foo: { baz: true },
      };

      configServiceMock.get.mockReturnValue({
        buzz: 'buzzValue',
        wizz: 'wizzValue',
        bar: 'barValue',
        baz: 'bazValue',
      });

      // When
      const result = await helper['getConfigParts'](parts);
      // Then
      expect(result).toEqual({
        Fizz: {
          buzz: 'buzzValue',
        },
        Foo: {
          baz: 'bazValue',
        },
      });
    });
  });
});
