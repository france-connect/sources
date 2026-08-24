import { NestJsDependencyInjectionWrapper, validateDto } from '@fc/common';

import { getLoggerMock } from '@mocks/logger';

import { IsOpenid4vpDeepLinkConstraint } from './is-openid4vp-deeplink.validator';

// Mock the validateDto function
jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  validateDto: jest.fn(),
  NestJsDependencyInjectionWrapper: { get: jest.fn() },
}));

describe('isOpenid4vpDeepLink', () => {
  let validator: IsOpenid4vpDeepLinkConstraint;
  const mockValidateDto = jest.mocked(validateDto);
  const mockNestJsDependencyInjectionWrapper = jest.mocked(
    NestJsDependencyInjectionWrapper,
  );

  const validationErrorMock = {
    property: 'property',
    constraints: {
      isIn: 'isIn',
    },
  };

  const mockLogger = getLoggerMock();

  beforeEach(() => {
    jest.clearAllMocks();

    validator = new IsOpenid4vpDeepLinkConstraint();

    mockNestJsDependencyInjectionWrapper.get.mockReturnValue(mockLogger);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true for a valid OpenID4VP deep link', async () => {
      // Given
      const validUrl = new URL(
        'openid4vp:clientId=requestId&request_uri=https://example.com/request&response_type=vp_token',
      );
      mockValidateDto.mockResolvedValueOnce([]);

      // When
      const result = await validator.validate(validUrl);

      // Then
      expect(result).toBe(true);
      expect(mockValidateDto).toHaveBeenCalledWith(
        validUrl,
        expect.any(Function), // Openid4vpDeepLinkDto class
        { whitelist: true },
      );
    });

    it('should return false for an invalid OpenID4VP deep link', async () => {
      // Given
      const invalidUrl = new URL(
        'openid4vp:clientId=requestId&request_uri=https://example.com/request&response_type=vp_token',
      );
      mockValidateDto.mockResolvedValueOnce([validationErrorMock]); // Simulate validation errors

      // When
      const result = await validator.validate(invalidUrl);

      // Then
      expect(result).toBe(false);
    });

    it('should return false for a URL with incorrect protocol', async () => {
      // Given
      const missingProtocolUrl = new URL('https://example.com/path');
      mockValidateDto.mockResolvedValueOnce([validationErrorMock]); // Simulate validation errors

      // When
      const result = await validator.validate(missingProtocolUrl);

      // Then
      expect(result).toBe(false);
    });

    it('should return false for missing required fields', async () => {
      // Given
      const missingRequiredFieldsUrl = new URL('openid4vp:clientId=requestId');
      mockValidateDto.mockResolvedValueOnce([validationErrorMock]); // Simulate validation errors

      // When
      const result = await validator.validate(missingRequiredFieldsUrl);

      // Then
      expect(result).toBe(false);
    });

    it('should return false for invalid request_uri protocol', async () => {
      // Given
      const invalidRequestUriUrl = new URL(
        'openid4vp:clientId=requestId&request_uri=http://example.com/request&response_type=vp_token',
      );
      mockValidateDto.mockResolvedValueOnce([validationErrorMock]); // Simulate validation errors

      // When
      const result = await validator.validate(invalidRequestUriUrl);

      // Then
      expect(result).toBe(false);
    });

    it('should return false for invalid response_type', async () => {
      // Given
      const invalidResponseTypeUrl = new URL(
        'openid4vp:clientId=requestId&request_uri=https://example.com/request&response_type=invalid',
      );
      mockValidateDto.mockResolvedValueOnce([validationErrorMock]); // Simulate validation errors

      // When
      const result = await validator.validate(invalidResponseTypeUrl);

      // Then
      expect(result).toBe(false);
    });

    it('should log the errors if there are any', async () => {
      // Given
      const invalidUrl = new URL(
        'openid4vp:clientId=requestId&request_uri=https://example.com/request&response_type=vp_token',
      );
      mockValidateDto.mockResolvedValueOnce([validationErrorMock]); // Simulate validation errors

      // When
      await validator.validate(invalidUrl);

      // Then
      expect(mockLogger.debug).toHaveBeenCalledWith({
        errors: [validationErrorMock],
      });
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', () => {
      // Given
      const result = new IsOpenid4vpDeepLinkConstraint().defaultMessage();

      // Then
      expect(result).toBe('The value must be a valid OpenID4VP deep link');
    });
  });
});
