import { FormDtoBase } from '../../dto';
import { TextAttributes } from '../../interfaces';
import { FORM_METADATA_TOKEN } from '../../tokens';
import { FormDecoratorHelper } from '../form-decorator.helper';
import { Text } from './text.decorator';

describe('Text', () => {
  class TestDto extends FormDtoBase {}
  const targetMock = new TestDto();
  const keyMock = 'country';
  const attributesMock = Symbol('attributesMock') as unknown as TextAttributes;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    Reflect.defineMetadata(FORM_METADATA_TOKEN, [], targetMock.constructor);

    jest.spyOn(Reflect, 'getMetadata');
    jest.spyOn(Reflect, 'defineMetadata');
    jest
      .spyOn(FormDecoratorHelper, 'generateTextMissingAttributes')
      .mockReturnValue(attributesMock);
  });

  it('should retrieve metadata for the given class', () => {
    // When
    Text(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.getMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      targetMock.constructor,
    );
  });

  it('should generate field text missing attributes', () => {
    // When
    Text(attributesMock)(targetMock, keyMock);

    // Then
    expect(
      FormDecoratorHelper.generateTextMissingAttributes,
    ).toHaveBeenCalledOnce();
    expect(
      FormDecoratorHelper.generateTextMissingAttributes,
    ).toHaveBeenCalledExactlyOnceWith(keyMock, attributesMock, 0, 'section');
  });

  it('should define metadata with the return of generateTextMissingAttributes for the given class', () => {
    // When
    Text(attributesMock)(targetMock, keyMock);

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
    Text(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.defineMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      [attributesMock],
      targetMock.constructor,
    );
  });
});
