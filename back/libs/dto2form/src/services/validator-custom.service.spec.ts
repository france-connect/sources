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

  describe('isFilled', () => {
    const valuesToTest = [
      [true, 0],
      [true, 1],
      [true, {}],
      [true, /./],
      [true, true],
      [true, 'string'],
      [true, () => null],
      [true, Symbol()],
      [false, ''],
      [false, null],
      [false, undefined],
      [false, []],
    ];

    it.each(valuesToTest)(
      'should return %p if value is value %p',
      (expected, value) => {
        // When / Then
        expect(service.isFilled(value)).toBe(expected);
      },
    );
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

  describe('isIpAddressesAndRange', () => {
    it('should return true if value is an IP', () => {
      // When / Then
      expect(service.isIpAddressesAndRange('37.65.14.169')).toBe(true);
    });

    it('should return true if value is an IP range', () => {
      // When / Then
      expect(service.isIpAddressesAndRange('1.1.1.1/32')).toBe(true);
    });

    it('should return false if value is neither IP or IP range', () => {
      // When / Then
      expect(service.isIpAddressesAndRange('not_an_ip')).toBe(false);
    });
  });

  describe('isSignedResponseAlg', () => {
    it('should return true if value is ES256', () => {
      // When / Then
      expect(service.isSignedResponseAlg('ES256')).toBe(true);
    });

    it('should return true if value is RS256', () => {
      // When / Then
      expect(service.isSignedResponseAlg('RS256')).toBe(true);
    });

    it('should return false if value is HS256', () => {
      // When / Then
      expect(service.isSignedResponseAlg('HS256')).toBe(false);
    });
  });

  describe('isWebsiteURL', () => {
    it('should return true if url has https protocol', () => {
      // When / Then
      expect(service.isWebsiteURL('https://franceconnect.gouv.fr')).toBe(true);
    });

    it('should return false if url has http protocol', () => {
      // When / Then
      expect(service.isWebsiteURL('http://franceconnect.gouv.fr')).toBe(false);
    });

    it('should return false if url has no protocol', () => {
      // When / Then
      expect(service.isWebsiteURL('franceconnect.gouv.fr')).toBe(false);
    });
  });

  describe('isRedirectURL', () => {
    it('should return true if url has https protocol', () => {
      // When / Then
      expect(service.isRedirectURL('https://franceconnect.gouv.fr')).toBe(true);
    });

    it('should return false if url has http protocol', () => {
      // When / Then
      expect(service.isRedirectURL('http://franceconnect.gouv.fr')).toBe(true);
    });

    it('should return true if url is localhost', () => {
      // When / Then
      expect(service.isRedirectURL('http://localhost/callback')).toBe(true);
    });

    it('should return false if url has no protocol', () => {
      // When / Then
      expect(service.isRedirectURL('franceconnect.gouv.fr')).toBe(false);
    });
  });
});
