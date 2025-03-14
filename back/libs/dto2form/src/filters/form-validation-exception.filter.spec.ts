import { ArgumentsHost } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { FcException } from '@fc/exceptions';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { generateErrorId } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import {
  FieldValidator,
  MetadataDtoTranslationInterface,
  ValidatorType,
} from '../interfaces';
import { PartnersI18nService } from '../services';
import { FormValidationExceptionFilter } from './form-validation-exception.filter';

jest.mock('@fc/exceptions/helpers', () => ({
  ...jest.requireActual('@fc/exceptions/helpers'),
  generateErrorId: jest.fn(),
}));

describe('FormValidationExceptionFilter', () => {
  let filter: FormValidationExceptionFilter;

  const generateErrorIdMock = jest.mocked(generateErrorId);

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const eventBusMock = {
    publish: jest.fn(),
  };

  const hostMock = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
    getResponse: jest.fn(),
  };

  const viewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  const partnersServiceMock = {
    translation: jest.fn(),
  };

  class ExceptionMock extends FcException {
    ERROR = 'ERROR';
    ERROR_DESCRIPTION = 'ERROR_DESCRIPTION';
    HTTP_STATUS_CODE = Symbol('HTTP_STATUS_CODE');
    UI: 'some error message';
  }

  let exceptionMock: ExceptionMock;

  const resMock = {
    status: jest.fn(),
    json: jest.fn(),
  };

  const codeMock = Symbol('code');
  const idMock = Symbol('id');

  const paramsMock = {
    res: resMock,
    httpResponseCode: 500,
    error: {
      code: codeMock,
      id: idMock,
      message: ExceptionMock.UI,
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormValidationExceptionFilter,
        ConfigService,
        LoggerService,
        EventBus,
        ViewTemplateService,
        PartnersI18nService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(ViewTemplateService)
      .useValue(viewTemplateServiceMock)
      .overrideProvider(PartnersI18nService)
      .useValue(partnersServiceMock)
      .compile();

    filter = module.get<FormValidationExceptionFilter>(
      FormValidationExceptionFilter,
    );

    filter['logException'] = jest.fn();
    filter['getExceptionCodeFor'] = jest.fn().mockReturnValue(codeMock);

    hostMock.switchToHttp.mockReturnThis();
    hostMock.getResponse.mockReturnValue(resMock);
    generateErrorIdMock.mockReturnValue(idMock as unknown as string);

    resMock.status.mockReturnThis();

    exceptionMock = new ExceptionMock();

    Object.assign(exceptionMock, {
      error: 'error',
      error_description: 'error_description',
      error_detail: 'error_detail',
      log: 'log',
    });

    Object.assign(paramsMock, { exception: exceptionMock });

    partnersServiceMock.translation.mockReturnValueOnce(exceptionMock.log);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    beforeEach(() => {
      filter['shouldNotRedirect'] = jest.fn().mockReturnValue(false);
      filter['getParams'] = jest.fn().mockReturnValue(paramsMock);
      filter['errorOutput'] = jest.fn();
      filter['transformToFinalForm'] = jest
        .fn()
        .mockReturnValueOnce(exceptionMock.log);
    });

    it('should call replaceWithI18n method to translate key', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(partnersServiceMock.translation).toHaveBeenCalledExactlyOnceWith(
        exceptionMock.log,
      );
    });

    it('should call transformToFinalForm', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(filter['transformToFinalForm']).toHaveBeenCalledExactlyOnceWith(
        exceptionMock.log,
      );
    });

    it('should publish an ExceptionCaughtEvent', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(eventBusMock.publish).toHaveBeenCalledExactlyOnceWith(
        expect.any(ExceptionCaughtEvent),
      );
    });

    it('should output the error', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(filter['errorOutput']).toHaveBeenCalledExactlyOnceWith(paramsMock);
    });
  });

  describe('errorOutput', () => {
    it('should set the status to 500', () => {
      // When
      filter['errorOutput'](paramsMock as unknown as ApiErrorParams);

      // Then
      expect(resMock.status).toHaveBeenCalledOnce();
      expect(resMock.status).toHaveBeenCalledWith(500);
    });

    it('should send the error in JSON', () => {
      // When
      filter['errorOutput'](paramsMock as unknown as ApiErrorParams);

      // Then
      expect(resMock.json).toHaveBeenCalledExactlyOnceWith({
        ...paramsMock.error,
        error: exceptionMock['error'],
        error_description: exceptionMock['error_description'],
        error_detail: exceptionMock['error_detail'],
        payload: exceptionMock['log'],
      });
    });
  });

  describe('transformToFinalForm', () => {
    beforeEach(() => {
      filter['getErrorMessages'] = jest.fn();
    });

    it('should call getErrorMessages with params', () => {
      // Given
      const payloadMock: MetadataDtoTranslationInterface[] = [
        {
          label: 'Field 1',
          name: 'field1',
          validators: [
            {
              name: 'isRequired',
              errorMessage: 'This field is required',
              validationArgs: [],
            },
            {
              name: 'isLength',
              errorMessage: 'Must be between 3 and 10 characters',
              validationArgs: [],
            },
          ],
        },
        {
          label: 'Field 2',
          name: 'field2',
          validators: [
            {
              name: 'isEmail',
              errorMessage: 'Must be a valid email',
              validationArgs: [],
            },
          ],
        },
      ];

      // When
      const _result = filter['transformToFinalForm'](payloadMock);

      // Then
      expect(filter['getErrorMessages']).toHaveBeenCalledTimes(2);
      expect(filter['getErrorMessages']).toHaveBeenNthCalledWith(
        1,
        payloadMock[0].validators,
      );
      expect(filter['getErrorMessages']).toHaveBeenNthCalledWith(
        2,
        payloadMock[1].validators,
      );
    });

    it('should transform the payload into a record with error labels', () => {
      // Given
      const payload: MetadataDtoTranslationInterface[] = [
        {
          label: 'Field 1',
          name: 'field1',
          validators: [
            {
              name: 'isRequired',
              errorMessage: 'This field is required',
              validationArgs: [],
            },
            {
              name: 'isLength',
              errorMessage: 'Must be between 3 and 10 characters',
              validationArgs: [],
            },
          ],
        },
      ];

      const expected = [
        'This field is required',
        'Must be between 3 and 10 characters',
      ];
      filter['getErrorMessages'] = jest.fn().mockReturnValue(expected);

      // When
      const result = filter['transformToFinalForm'](payload);

      // Then
      expect(result).toEqual({ field1: expected });
    });

    it('should skip fields without validators', () => {
      // Given
      const payload: MetadataDtoTranslationInterface[] = [
        {
          label: 'Field 1',
          name: 'field1',
          validators: [],
        },
        {
          label: 'Field 2',
          name: 'field2',
          validators: undefined,
        },
      ];

      // When
      const result = filter['transformToFinalForm'](payload);

      // Then
      expect(filter['getErrorMessages']).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });

    it('should return an empty object if the payload is empty', () => {
      // Given
      const payload: MetadataDtoTranslationInterface[] = [];

      // When
      const result = filter['transformToFinalForm'](payload);

      // Then
      expect(filter['getErrorMessages']).not.toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('getErrorMessages', () => {
    it('should call extractErrorMessage with params', () => {
      // Given
      const nestedValidatorsMock: ValidatorType[] = [
        {
          name: 'isRequired',
          errorMessage: 'This field is required',
          validationArgs: [],
        },
        [
          {
            name: 'isLength',
            errorMessage: 'Must be between 3 and 10 characters',
            validationArgs: [],
          },
          {
            name: 'isEmail',
            errorMessage: 'Must be a valid email',
            validationArgs: [],
          },
        ],
      ];

      filter['extractErrorMessage'] = jest
        .fn()
        .mockReturnValueOnce('This field is required')
        .mockReturnValueOnce([
          'Must be between 3 and 10 characters',
          'Must be a valid email',
        ]);

      // When
      const result = filter['getErrorMessages'](nestedValidatorsMock);

      // Then
      expect(filter['extractErrorMessage']).toHaveBeenCalledTimes(2);
      expect(filter['extractErrorMessage']).toHaveBeenNthCalledWith(
        1,
        nestedValidatorsMock[0],
      );
      expect(filter['extractErrorMessage']).toHaveBeenNthCalledWith(
        2,
        nestedValidatorsMock[1],
      );
      expect(result).toEqual([
        'This field is required',
        ['Must be between 3 and 10 characters', 'Must be a valid email'],
      ]);
    });
  });
  describe('extractErrorMessagesFromArray', () => {
    it('should extract error labels for an array of validators', () => {
      // Given
      const validatorMock: FieldValidator[] = [
        {
          name: 'isRequired',
          errorMessage: 'This field is required',
          validationArgs: [],
        },
        {
          name: 'isLength',
          errorMessage: 'Must be between 3 and 10 characters',
          validationArgs: [],
        },
      ];

      // When
      const result = filter['extractErrorMessagesFromArray'](validatorMock);

      // Then
      expect(result).toEqual([
        'This field is required',
        'Must be between 3 and 10 characters',
      ]);
    });

    it('should return an empty array if the validator array is empty', () => {
      // Given
      const emptyValidatorsMock: FieldValidator[] = [];

      // When
      const result =
        filter['extractErrorMessagesFromArray'](emptyValidatorsMock);

      // Then
      expect(result).toEqual([]);
    });
  });

  describe('extractErrorMessage', () => {
    it('should return the errorMessage for a single validator', () => {
      // Given
      const validatorMock: FieldValidator = {
        name: 'isRequired',
        errorMessage: 'This field is required',
        validationArgs: [],
      };

      // When
      const result = filter['extractErrorMessage'](validatorMock);

      // Then
      expect(result).toEqual('This field is required');
    });

    it('should extract error labels for an array of validators', () => {
      // Given
      const validatorMock: FieldValidator[] = [
        {
          name: 'isRequired',
          errorMessage: 'This field is required',
          validationArgs: [],
        },
        {
          name: 'isLength',
          errorMessage: 'Must be between 3 and 10 characters',
          validationArgs: [],
        },
      ];

      // When
      const result = filter['extractErrorMessage'](validatorMock);

      // Then
      expect(result).toEqual([
        'This field is required',
        'Must be between 3 and 10 characters',
      ]);
    });

    it('should return an empty array if the validator array is empty', () => {
      // Given
      const emptyValidatorsMock: FieldValidator[] = [];

      // When
      const result = filter['extractErrorMessage'](emptyValidatorsMock);

      // Then
      expect(result).toEqual([]);
    });
  });
});
