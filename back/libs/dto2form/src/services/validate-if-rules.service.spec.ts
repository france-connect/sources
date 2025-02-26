import { Test, TestingModule } from '@nestjs/testing';

import { getValidatorCustomServiceMock } from '@mocks/dto2form';

import { ValidateIfRulesService } from './validate-if-rules.service';
import { ValidatorCustomService } from './validator-custom.service';

describe('ValidateIfRulesService', () => {
  let service: ValidateIfRulesService;

  const validatorCustomMock = getValidatorCustomServiceMock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateIfRulesService, ValidatorCustomService],
    })
      .overrideProvider(ValidatorCustomService)
      .useValue(validatorCustomMock)
      .compile();

    service = module.get<ValidateIfRulesService>(ValidateIfRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ifNotEmpty', () => {
    it('should call isNotEmpty with given arguments', () => {
      // When
      service.ifNotEmpty('string');

      // Then
      expect(validatorCustomMock.isNotEmpty).toHaveBeenCalledExactlyOnceWith(
        'string',
      );
    });

    it('should return the result of isNotEmpty call', () => {
      // Given
      const isNotEmptyResult = Symbol('true');
      validatorCustomMock.isNotEmpty.mockReturnValueOnce(isNotEmptyResult);

      // When
      const result = service.ifNotEmpty('string');

      // Then
      expect(result).toBe(isNotEmptyResult);
    });
  });

  describe('ifDefined', () => {
    it('should return true if the value is defined', () => {
      // When
      const result = service.ifDefined('value');

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the value is not defined', () => {
      // When
      const result = service.ifDefined(undefined);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('ifFieldFilled', () => {
    it('should call isFilled with given arguments and the value of the targeted field', () => {
      // Given
      const customValidationOptions = { target: { targetField: 'value' } };

      // When
      service.ifFieldFilled('value', 'targetField', customValidationOptions);

      // Then
      expect(validatorCustomMock.isFilled).toHaveBeenCalledExactlyOnceWith(
        'value',
      );
    });

    it('should return the result of isFilled call', () => {
      // Given
      const customValidationOptions = { target: { targetField: 'value' } };
      const isFilledResult = Symbol('true');
      validatorCustomMock.isFilled.mockReturnValueOnce(isFilledResult);

      // When
      const result = service.ifFieldFilled(
        'value',
        'targetField',
        customValidationOptions,
      );

      // Then
      expect(result).toBe(isFilledResult);
    });
  });

  describe('ifFieldNotEmpty', () => {
    it('should call isNotEmpty with given arguments and the value of the targeted field', () => {
      // Given
      const customValidationOptions = { target: { targetField: 'value' } };

      // When
      service.ifFieldNotEmpty('value', 'targetField', customValidationOptions);

      // Then
      expect(validatorCustomMock.isNotEmpty).toHaveBeenCalledExactlyOnceWith(
        'value',
      );
    });

    it('should return the result of isNotEmpty call', () => {
      // Given
      const customValidationOptions = { target: { targetField: 'value' } };
      const isNotEmptyResult = Symbol('true');
      validatorCustomMock.isNotEmpty.mockReturnValueOnce(isNotEmptyResult);

      // When
      const result = service.ifFieldNotEmpty(
        'value',
        'targetField',
        customValidationOptions,
      );

      // Then
      expect(result).toBe(isNotEmptyResult);
    });
  });

  describe('ifFieldDefined', () => {
    it('should return true if the targeted field is defined', () => {
      // Given
      const customValidationOptions = { target: { targetField: 'value' } };

      // When
      const result = service.ifFieldDefined(
        'targetField',
        customValidationOptions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the targeted field is not defined', () => {
      // Given
      const customValidationOptions = { target: {} };

      // When
      const result = service.ifFieldDefined(
        'targetField',
        customValidationOptions,
      );

      // Then
      expect(result).toBe(false);
    });
  });
});
