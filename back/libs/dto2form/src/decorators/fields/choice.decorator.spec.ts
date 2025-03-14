import { FieldsChoice } from '@fc/dto2form/enums';

import { FormDtoBase } from '../../dto';
import { ChoiceAttributes, ChoiceAttributesArguments } from '../../interfaces';
import { FORM_METADATA_TOKEN } from '../../tokens';
import { FormDecoratorHelper } from '../form-decorator.helper';
import { Choice } from './choice.decorator';

describe('Select', () => {
  class TestDto extends FormDtoBase {}
  const targetMock = new TestDto();
  const keyMock = 'country';
  const attributesMock = Symbol(
    'attributesMock',
  ) as unknown as ChoiceAttributesArguments;

  const expectedAttributesMock = Symbol(
    'expectedAttributesMock',
  ) as unknown as ChoiceAttributes;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    Reflect.defineMetadata(FORM_METADATA_TOKEN, [], targetMock.constructor);

    jest.spyOn(Reflect, 'getMetadata');
    jest.spyOn(Reflect, 'defineMetadata');
    jest
      .spyOn(FormDecoratorHelper, 'generateFieldMissingAttributes')
      .mockReturnValueOnce(expectedAttributesMock);
    jest
      .spyOn(FormDecoratorHelper, 'generateInputChoiceMissingAttributes')
      .mockReturnValueOnce(expectedAttributesMock);
    jest
      .spyOn(FormDecoratorHelper, 'handleRequiredField')
      .mockReturnValueOnce(expectedAttributesMock);
  });

  it('should retrieve metadata for the given class', () => {
    // When
    Choice(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.getMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      targetMock.constructor,
    );
  });

  it('should generate field missing attributes', () => {
    // When
    Choice(attributesMock)(targetMock, keyMock);

    // Then
    expect(
      FormDecoratorHelper.generateFieldMissingAttributes,
    ).toHaveBeenCalledOnce();
    expect(
      FormDecoratorHelper.generateFieldMissingAttributes,
    ).toHaveBeenCalledExactlyOnceWith(keyMock, attributesMock, 0, 'select');
  });

  it('should generate input choice missing attributes if type is radio or checkbox', () => {
    // Given
    const attributesMock = {
      type: FieldsChoice.RADIO,
    } as unknown as ChoiceAttributesArguments;

    // When
    Choice(attributesMock)(targetMock, keyMock);

    // Then
    expect(
      FormDecoratorHelper.generateInputChoiceMissingAttributes,
    ).toHaveBeenCalledOnce();
    expect(
      FormDecoratorHelper.generateInputChoiceMissingAttributes,
    ).toHaveBeenCalledExactlyOnceWith(expectedAttributesMock);
  });

  it('should call handleRequiredField', () => {
    // When
    Choice(attributesMock)(targetMock, keyMock);

    // Then
    expect(FormDecoratorHelper.handleRequiredField).toHaveBeenCalledOnce();
    expect(
      FormDecoratorHelper.handleRequiredField,
    ).toHaveBeenCalledExactlyOnceWith(expectedAttributesMock);
  });

  it('should define metadata with the return of generateFieldMissingAttributes for the given class', () => {
    // When
    Choice(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.defineMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      [expectedAttributesMock],
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
    Choice(attributesMock)(targetMock, keyMock);

    // Then
    expect(Reflect.defineMetadata).toHaveBeenCalledExactlyOnceWith(
      FORM_METADATA_TOKEN,
      [expectedAttributesMock],
      targetMock.constructor,
    );
  });
});
