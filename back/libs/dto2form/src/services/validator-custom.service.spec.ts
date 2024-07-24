import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { ValidatorCustomService } from './validator-custom.service';

describe('ValidatorCustomService', () => {
  let service: ValidatorCustomService;

  const configServiceMock = getConfigMock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidatorCustomService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<ValidatorCustomService>(ValidatorCustomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isString', () => {
    const valuesToTest = [
      [true, 'string'],
      [true, ''],
      [false, null],
      [false, undefined],
      [false, {}],
      [false, []],
      [false, true],
      [false, 1],
      [false, Symbol()],
      [false, () => null],
      [false, /./],
    ];

    it.each(valuesToTest)(
      'should return %p if value is value %p',
      (expected, value) => {
        // When / Then
        expect(service.isString(value)).toBe(expected);
      },
    );
  });

  describe('isNotEmpty', () => {
    it('should return true if value is not empty', () => {
      // When / Then
      expect(service.isNotEmpty('string')).toBe(true);
    });

    it('should return false if value is empty', () => {
      // When / Then
      expect(service.isNotEmpty('')).toBe(false);
    });
  });

  describe('isNotEqualToField', () => {
    const target = { targetField: 'target' };

    it('should return true if value is not equal to target field', () => {
      // When
      const result = service.isNotEqualToField('toto42', 'targetField', {
        target,
      });

      expect(result).toBe(true);
    });

    it('should return false if value is equal to target field', () => {
      // When
      const result = service.isNotEqualToField(
        target.targetField,
        'targetField',
        {
          target,
        },
      );

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isEqualToConfig', () => {
    const configName = 'configName';
    const configField = 'configField';
    const configValue = 'configValue';

    beforeEach(() => {
      configServiceMock.get.mockReturnValue({
        configField: configValue,
      });
    });

    it('should return true if value is equal to config field', () => {
      // When
      const result = service.isEqualToConfig(
        configValue,
        configName,
        configField,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if value is not equal to config field', () => {
      // When
      const result = service.isEqualToConfig('toto42', configName, configField);

      // Then
      expect(result).toBe(false);
    });
  });
});
