import { validateDto } from '@fc/common';
import { validationOptions } from '@fc/config';

import { LoggerLevelNames } from '../enum';
import { LoggerConfig } from './logger-config.dto';

describe('LoggerConfig', () => {
  const correctObjectMock = {
    level: LoggerLevelNames.INFO,
    isDevelopment: true,
    path: '/dev/null',
  };

  describe('global validation', () => {
    it('should validate correctObjectMock', async () => {
      // When
      const errors = await validateDto(
        correctObjectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toEqual([]);
    });
  });

  describe('level', () => {
    it('should not accept values not in enum', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        level: 'foo',
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('level');
    });
  });

  describe('isDevelopment', () => {
    it('shoud not allow truthy non boolean values', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        isDevelopment: 'true',
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isDevelopment');
    });
    it('shoud not allow falsy non boolean values', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        isDevelopment: '',
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isDevelopment');
    });
    it('shoud not allow null', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        isDevelopment: null,
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isDevelopment');
    });
    it('shoud not allow undefined', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        isDevelopment: undefined,
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('isDevelopment');
    });
  });

  describe('path', () => {
    it('should not accept empy value', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        path: '',
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('path');
    });
    it('should not accept boolean value', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        path: true,
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('path');
    });
    it('should not accept array value', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        path: [],
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('path');
    });
    it('should not accept object value', async () => {
      // Given
      const objectMock = {
        ...correctObjectMock,
        path: {},
      };
      // When
      const errors = await validateDto(
        objectMock,
        LoggerConfig,
        validationOptions,
      );
      // Then
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('path');
    });
  });
});
