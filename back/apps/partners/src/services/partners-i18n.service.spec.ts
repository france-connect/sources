import { Test, TestingModule } from '@nestjs/testing';

import {
  MetadataDtoInterface,
  MetadataDtoValidatorsInterface,
  ValidatorType,
} from '@fc/dto2form';
import { I18nService } from '@fc/i18n';

import { getI18nServiceMock } from '@mocks/i18n';

import { PartnersI18nService } from './partners-i18n.service';

describe('PartnersService', () => {
  let service: PartnersI18nService;

  const i18nMock = getI18nServiceMock();

  const payloadMock = [
    {
      validators: [{ name: 'isLength' }],
      name: 'nameMock1',
      label: 'nameMock1_label',
      type: 'input',
    },
    {
      validators: [{ name: 'isFoo' }],
      name: 'nameMock2',
      label: 'knameMock2_label',
      type: 'input',
    },
  ] as unknown as MetadataDtoInterface[];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnersI18nService, I18nService],
    })
      .overrideProvider(I18nService)
      .useValue(i18nMock)
      .compile();

    service = module.get<PartnersI18nService>(PartnersI18nService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('translation', () => {
    beforeEach(() => {
      service['getValidatorsWithErrorLabels'] = jest
        .fn()
        .mockReturnValueOnce({
          errorLabel: 'errorLabel nameMock1',
          name: 'isLength',
          validationArgs: [],
        })
        .mockReturnValueOnce({
          errorLabel: 'errorLabel nameMock2',
          name: 'nameMock2',
          validationArgs: [],
        });
    });

    it('should call getTranslation once for text and return result', () => {
      // Given
      const payloadMock = [
        {
          name: 'nameMock1',
          type: 'section',
        },
      ] as unknown as MetadataDtoInterface[];
      const labelMock = Symbol('labelMock');

      service['getTranslation'] = jest.fn().mockReturnValueOnce(labelMock);

      const expected = [{ ...payloadMock[0], label: labelMock }];

      // When
      const result = service.translation(payloadMock);

      // Then
      expect(service['getTranslation']).toHaveBeenCalledTimes(1);
      expect(service['getTranslation']).toHaveBeenCalledWith(
        'label',
        'nameMock1',
      );
      expect(result).toEqual(expected);
    });

    it('should call getTranslation twice for label and hint', () => {
      // Given
      service['getTranslation'] = jest
        .fn()
        .mockReturnValueOnce('label nameMock1')
        .mockReturnValueOnce('hint nameMock1')
        .mockReturnValueOnce('label nameMock2')
        .mockReturnValueOnce('hint nameMock2');

      // When
      const _result = service.translation(payloadMock);

      // Then
      expect(service['getTranslation']).toHaveBeenCalledTimes(4);
      expect(service['getTranslation']).toHaveBeenNthCalledWith(
        1,
        'label',
        payloadMock[0].name,
      );
      expect(service['getTranslation']).toHaveBeenNthCalledWith(
        2,
        'hint',
        payloadMock[0].name,
      );
      expect(service['getTranslation']).toHaveBeenNthCalledWith(
        3,
        'label',
        payloadMock[1].name,
      );
      expect(service['getTranslation']).toHaveBeenNthCalledWith(
        4,
        'hint',
        payloadMock[1].name,
      );
    });

    it('should call getValidatorsWithErrorLabels to put i18n translation into validator object', () => {
      // When
      const _result = service.translation(payloadMock);

      // Then
      expect(service['getValidatorsWithErrorLabels']).toHaveBeenCalledTimes(2);
      expect(service['getValidatorsWithErrorLabels']).toHaveBeenNthCalledWith(
        1,
        payloadMock[0].validators,
        payloadMock[0].name,
      );
      expect(service['getValidatorsWithErrorLabels']).toHaveBeenNthCalledWith(
        2,
        payloadMock[1].validators,
        payloadMock[1].name,
      );
    });

    it('should return a translated payload', () => {
      // Given
      service['getTranslation'] = jest
        .fn()
        .mockReturnValueOnce('label nameMock1')
        .mockReturnValueOnce('hint nameMock1')
        .mockReturnValueOnce('label nameMock2')
        .mockReturnValueOnce('hint nameMock2');

      const expected = [
        {
          label: 'label nameMock1',
          hint: 'hint nameMock1',
          name: 'nameMock1',
          type: 'input',
          validators: {
            errorLabel: 'errorLabel nameMock1',
            name: 'isLength',
            validationArgs: [],
          },
        },
        {
          label: 'label nameMock2',
          hint: 'hint nameMock2',
          name: 'nameMock2',
          type: 'input',
          validators: {
            errorLabel: 'errorLabel nameMock2',
            name: 'nameMock2',
            validationArgs: [],
          },
        },
      ];

      // When
      const result = service.translation(payloadMock);

      // Then
      expect(result).toEqual(expected);
    });
  });

  describe('getTranslation', () => {
    const typeMock = 'type';
    const nameMock = 'name';

    it('should call translate method form i18n service without options', () => {
      // Given
      const expected = `Form.${typeMock}.${nameMock}`;
      // When
      service['getTranslation'](typeMock, nameMock);

      // Then
      expect(i18nMock.translate).toHaveBeenCalledTimes(1);
      expect(i18nMock.translate).toHaveBeenCalledWith(expected, undefined);
    });

    it('should call translate method form i18n service with options', () => {
      // Given
      const optionsMock = { max: 30 };
      const expected = `Form.${typeMock}.${nameMock}`;
      // When
      service['getTranslation'](typeMock, nameMock, optionsMock);

      // Then
      expect(i18nMock.translate).toHaveBeenCalledTimes(1);
      expect(i18nMock.translate).toHaveBeenCalledWith(expected, optionsMock);
    });
  });

  describe('getValidatorsWithErrorLabels', () => {
    it('should call processValidatorsRecursively and pass params', () => {
      // Given
      const validatorMock = Symbol('validator') as unknown as ValidatorType;
      const nameMock = Symbol('name') as unknown as string;

      const expected = Symbol('validator returned');

      service['processValidatorsRecursively'] = jest
        .fn()
        .mockReturnValueOnce(expected);

      // When
      const result = service['getValidatorsWithErrorLabels'](
        validatorMock,
        nameMock,
      );

      // Then
      expect(service['processValidatorsRecursively']).toHaveBeenCalledTimes(1);
      expect(service['processValidatorsRecursively']).toHaveBeenCalledWith(
        validatorMock,
        nameMock,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('processValidatorsRecursively', () => {
    const nameMock = 'nameMock';

    beforeEach(() => {
      jest
        .spyOn(service as any, 'enhanceValidatorWithErrorLabel')
        .mockImplementation(
          (validator: MetadataDtoValidatorsInterface, name: string) => ({
            ...validator,
            errorLabel: `Processed ${name}`,
          }),
        );

      jest.spyOn(service as any, 'processValidatorsRecursively');
    });

    it('should process nested arrays of validators and make recursive calls', () => {
      // Given
      const validatorsMock: MetadataDtoValidatorsInterface[][] = [
        [
          { name: 'isRequired', errorLabel: '', validationArgs: [] },
          { name: 'isEmail', errorLabel: '', validationArgs: [] },
        ],
      ];

      // When
      const result = service['processValidatorsRecursively'](
        validatorsMock,
        nameMock,
      );

      // Then
      expect(service['enhanceValidatorWithErrorLabel']).toHaveBeenCalledTimes(
        2,
      );
      expect(service['processValidatorsRecursively']).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        [
          { ...validatorsMock[0][0], errorLabel: 'Processed nameMock' },
          { ...validatorsMock[0][1], errorLabel: 'Processed nameMock' },
        ],
      ]);
    });

    it('should process a flat array of validators', () => {
      // Given
      const validatorsMock: MetadataDtoValidatorsInterface[] = [
        { name: 'isLength', errorLabel: '', validationArgs: [] },
        { name: 'isRequired', errorLabel: '', validationArgs: [] },
      ];

      // When
      const result = service['processValidatorsRecursively'](
        validatorsMock,
        nameMock,
      );

      // Then
      expect(service['enhanceValidatorWithErrorLabel']).toHaveBeenCalledTimes(
        2,
      );
      expect(service['processValidatorsRecursively']).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { ...validatorsMock[0], errorLabel: 'Processed nameMock' },
        { ...validatorsMock[1], errorLabel: 'Processed nameMock' },
      ]);
    });
  });

  describe('enhanceValidatorWithErrorLabel', () => {
    const nameMock = Symbol('nameMock') as unknown as string;

    beforeEach(() => {
      service['getTranslation'] = jest
        .fn()
        .mockReturnValueOnce('label errorLabel');
    });

    it('should call generateI18nIsLengthParams', () => {
      // Given
      const validatorsMock: MetadataDtoValidatorsInterface = {
        name: 'isLength',
        errorLabel: 'errorLabel',
        validationArgs: [{ max: 10 }],
      };

      service['generateI18nIsLengthParams'] = jest
        .fn()
        .mockReturnValueOnce({ suffix: '', options: {} });

      // When
      service['enhanceValidatorWithErrorLabel'](validatorsMock, nameMock);

      // Then
      expect(service['generateI18nIsLengthParams']).toHaveBeenCalledTimes(1);
      expect(service['generateI18nIsLengthParams']).toHaveBeenCalledWith(
        validatorsMock.validationArgs[0],
      );
    });

    it('should call getTranslation with "max" value in option', () => {
      // Given
      const validatorsMock: MetadataDtoValidatorsInterface = {
        name: 'isLength',
        errorLabel: 'errorLabel',
        validationArgs: [{ max: 10 }],
      };

      const response = {
        suffix: '.max',
        options: { max: 10 },
      };

      service['generateI18nIsLengthParams'] = jest
        .fn()
        .mockReturnValueOnce(response);

      // When
      service['enhanceValidatorWithErrorLabel'](validatorsMock, nameMock);

      // Then
      expect(service['getTranslation']).toHaveBeenCalledTimes(1);
      expect(service['getTranslation']).toHaveBeenCalledWith(
        `${validatorsMock.errorLabel}${response.suffix}`,
        nameMock,
        { max: 10 },
      );
    });

    it('should call getTranslation with "min" value in option', () => {
      // Given
      const validatorsMock: MetadataDtoValidatorsInterface = {
        name: 'isLength',
        errorLabel: 'errorLabel',
        validationArgs: [{ min: 10 }],
      };

      const response = {
        suffix: '.min',
        options: { min: 10 },
      };

      service['generateI18nIsLengthParams'] = jest
        .fn()
        .mockReturnValueOnce(response);

      // When
      service['enhanceValidatorWithErrorLabel'](validatorsMock, nameMock);

      // Then
      expect(service['getTranslation']).toHaveBeenCalledTimes(1);
      expect(service['getTranslation']).toHaveBeenCalledWith(
        `${validatorsMock.errorLabel}${response.suffix}`,
        nameMock,
        { min: 10 },
      );
    });

    it('should call getTranslation with "min" and "max" value in option', () => {
      // Given
      const validatorsMock: MetadataDtoValidatorsInterface = {
        name: 'isLength',
        errorLabel: 'errorLabel',
        validationArgs: [{ max: 20, min: 10 }],
      };

      const response = {
        suffix: '.max.min',
        options: { max: 20, min: 10 },
      };

      service['generateI18nIsLengthParams'] = jest
        .fn()
        .mockReturnValueOnce(response);

      // When
      service['enhanceValidatorWithErrorLabel'](validatorsMock, nameMock);

      // Then
      expect(service['getTranslation']).toHaveBeenCalledTimes(1);
      expect(service['getTranslation']).toHaveBeenCalledWith(
        `${validatorsMock.errorLabel}${response.suffix}`,
        nameMock,
        { min: 10, max: 20 },
      );
    });

    it('should call getTranslation for default name validator', () => {
      // Given
      const validatorsMock = {
        name: 'otherName',
        errorLabel: 'errorLabel',
        validationArgs: [{ max: 20, min: 10 }],
      } as unknown as MetadataDtoValidatorsInterface;

      // When
      service['enhanceValidatorWithErrorLabel'](validatorsMock, nameMock);

      // Then
      expect(service['getTranslation']).toHaveBeenCalledTimes(1);
      expect(service['getTranslation']).toHaveBeenCalledWith(
        validatorsMock.errorLabel,
        nameMock,
      );
    });

    it('should return validators with i18n translation', () => {
      // Given
      const validatorsMock = {
        name: 'otherName',
        errorLabel: 'errorLabel',
        validationArgs: [],
      } as unknown as MetadataDtoValidatorsInterface;

      const expected = {
        errorLabel: 'label errorLabel',
        name: 'otherName',
        validationArgs: [],
      };

      // When
      const result = service['enhanceValidatorWithErrorLabel'](
        validatorsMock,
        nameMock,
      );

      // Then
      expect(result).toEqual(expected);
    });
  });

  describe('generateI18nIsLengthParams', () => {
    it('should return the correct spec and object for { max: 10 }', () => {
      const validationArgs = { max: 10 };
      const result = service['generateI18nIsLengthParams'](validationArgs);

      expect(result).toEqual({
        suffix: '.max',
        options: { max: 10 },
      });
    });

    it('should return the correct spec and object for { min: 10 }', () => {
      const validationArgs = { min: 10 };
      const result = service['generateI18nIsLengthParams'](validationArgs);

      expect(result).toEqual({
        suffix: '.min',
        options: { min: 10 },
      });
    });

    it('should return the correct spec and object for { max: 10, min: 5 }', () => {
      const validationArgs = { max: 10, min: 5 };
      const result = service['generateI18nIsLengthParams'](validationArgs);

      expect(result).toEqual({
        suffix: '.max.min',
        options: { max: 10, min: 5 },
      });
    });

    it('should ignore keys other than max and min', () => {
      const validationArgs = { max: 10, min: 5, other: 20 };
      const result = service['generateI18nIsLengthParams'](validationArgs);

      expect(result).toEqual({
        suffix: '.max.min',
        options: { max: 10, min: 5 },
      });
    });
  });
});
