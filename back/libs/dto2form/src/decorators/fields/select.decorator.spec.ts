import { FormDtoBase } from '../../dto';
import { SelectAttributes } from '../../interfaces';
import { FORM_METADATA_TOKEN } from '../../tokens';
import { FormDecoratorHelper } from '../form-decorator.helper';
import { Select } from './select.decorator';

describe('Select', () => {
  class TestDto extends FormDtoBase {}
  const targetMock = new TestDto();
  const keyMock = 'country';
  const attributesMock = Symbol(
    'attributesMock',
  ) as unknown as SelectAttributes;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    Reflect.defineMetadata(FORM_METADATA_TOKEN, [], targetMock.constructor);

    jest.spyOn(Reflect, 'getMetadata');
    jest.spyOn(Reflect, 'defineMetadata');
    jest
      .spyOn(FormDecoratorHelper, 'generateFieldMissingAttributes')
      .mockReturnValue(attributesMock);
  });

  it('should retrieve metadata for the given class', () => {
    // When
    Select(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.getMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      targetMock.constructor,
    );
  });

  it('should generate field missing attributes', () => {
    // When
    Select(attributesMock)(targetMock, keyMock);

    // Then
    expect(
      FormDecoratorHelper.generateFieldMissingAttributes,
    ).toHaveBeenCalledOnce();
    expect(
      FormDecoratorHelper.generateFieldMissingAttributes,
    ).toHaveBeenCalledExactlyOnceWith(keyMock, attributesMock, 0, 'select');
  });

  it('should define metadata with the return of generateFieldMissingAttributes for the given class', () => {
    // When
    Select(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.defineMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      [attributesMock],
      targetMock.constructor,
    );
  });

  it('should create a new metadata if there is no metadata for the given class', () => {
    // Given
    Reflect.defineMetadata(
      FORM_METADATA_TOKEN,
      undefined,
      targetMock.constructor,
    );
    jest.mocked(Reflect.defineMetadata).mockClear();

    // When
    Select(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.defineMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      [attributesMock],
      targetMock.constructor,
    );
  });
});
