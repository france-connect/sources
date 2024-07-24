import { ValidationError } from 'class-validator';
import * as deepFreeze from 'deep-freeze';

import { validateDtoSync } from '@fc/common';

import { FieldDto, FormDtoBase } from '../dto';
import { FORM_METADATA_TOKEN } from '../tokens';
import { Form } from './form.decorator';
import { FormDecoratorHelper } from './form-decorator.helper';

jest.mock('@fc/common');
jest.mock('deep-freeze');
jest.mock('./form-decorator.helper');

describe('Form', () => {
  let service: (constructor: FormDtoBase) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    service = Form();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('service', () => {
    const mockConstructor = class {};
    const metadata = [Symbol('metadata'), Symbol('metadata2')];

    beforeEach(() => {
      jest.mocked(validateDtoSync).mockReturnValue([]);

      jest.spyOn(Reflect, 'getMetadata').mockReturnValueOnce(metadata);
    });

    it('should check that the form is correctly formatted', () => {
      // When
      service(mockConstructor);

      // Then
      expect(
        FormDecoratorHelper.checkCompatibility,
      ).toHaveBeenCalledExactlyOnceWith(mockConstructor);
    });

    it('should get the metadata', () => {
      // When
      service(mockConstructor);

      // Then
      expect(Reflect.getMetadata).toHaveBeenCalledExactlyOnceWith(
        FORM_METADATA_TOKEN,
        mockConstructor,
      );
    });

    it('should validate the metadata', () => {
      // When
      service(mockConstructor);

      // Then
      expect(validateDtoSync).toHaveBeenCalledTimes(metadata.length);
      expect(validateDtoSync).toHaveBeenNthCalledWith(
        1,
        metadata[0],
        FieldDto,
        {},
      );
      expect(validateDtoSync).toHaveBeenNthCalledWith(
        2,
        metadata[1],
        FieldDto,
        {},
      );
    });

    it('should throw an error with the stringified errors if there are errors', () => {
      // Given
      const dtoErrorsMock: ValidationError[] = [
        {
          children: [],
          constraints: {},
          property: 'property_1',
          target: {},
        },
      ];
      const expectedError = new Error(
        JSON.stringify([dtoErrorsMock, dtoErrorsMock]),
      );
      jest.mocked(validateDtoSync).mockReset().mockReturnValue(dtoErrorsMock);

      // When / Then
      expect(() => service(mockConstructor)).toThrow(expectedError);
    });

    it('should freeze the metadata', () => {
      // When
      service(mockConstructor);

      // Then
      expect(deepFreeze).toHaveBeenCalledExactlyOnceWith(metadata);
    });

    it('should set the metadata', () => {
      // Given
      const frozenMetadata = Symbol('frozen');
      jest.mocked(deepFreeze).mockReturnValueOnce(frozenMetadata);
      jest.spyOn(Reflect, 'defineMetadata');

      // When
      service(mockConstructor);

      // Then
      expect(Reflect.defineMetadata).toHaveBeenCalledExactlyOnceWith(
        FORM_METADATA_TOKEN,
        frozenMetadata,
        mockConstructor,
      );
    });
  });
});
