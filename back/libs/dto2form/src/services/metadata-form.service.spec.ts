import { Test, TestingModule } from '@nestjs/testing';

import { Form, Input } from '../decorators';
import { $IsNotEmpty, $IsString } from '../descriptors';
import { Dto2FormInvalidMetadataException } from '../exceptions';
import { MetadataFormService } from './metadata-form.service';

describe('MetadataFormService', () => {
  let service: MetadataFormService;

  @Form()
  class TestDto {
    @Input({
      required: true,
      order: 0,
      validators: [$IsString(), $IsNotEmpty()],
    })
    given_name: string;
  }

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataFormService],
    }).compile();

    service = module.get<MetadataFormService>(MetadataFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDtoMetadata', () => {
    it('should return metadata for a valid DTO', () => {
      // Given
      const mockMetadata = [
        {
          required: true,
          order: 0,
          validators: [
            {
              name: 'isString',
              errorLabel: 'given_name_isString_error',
              validationArgs: [],
            },
            {
              name: 'isNotEmpty',
              errorLabel: 'given_name_isNotEmpty_error',
              validationArgs: [],
            },
          ],
          validateIf: [],
          type: 'text',
          name: 'given_name',
          label: 'given_name_label',
        },
      ];

      // When
      const metadata = service.getDtoMetadata(TestDto);

      // Then
      expect(metadata).toEqual(mockMetadata);
    });

    it('should throw an error if no metadata is found for the DTO', () => {
      // Given
      jest.spyOn(Reflect, 'getMetadata').mockReturnValue(undefined);

      // Vérifier que la méthode lance une erreur si aucune métadonnée n'est trouvée
      expect(() => service.getDtoMetadata(TestDto)).toThrow(
        Dto2FormInvalidMetadataException,
      );
    });
  });
});
