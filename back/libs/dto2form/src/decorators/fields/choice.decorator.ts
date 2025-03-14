import 'reflect-metadata';

import { FieldsChoice } from '@fc/dto2form/enums';

import { FormDtoBase } from '../../dto';
import {
  ChoiceAttributes,
  ChoiceAttributesArguments,
  FieldAttributes,
} from '../../interfaces';
import { FORM_METADATA_TOKEN } from '../../tokens';
import { FormDecoratorHelper } from '../form-decorator.helper';

export function Choice(attributes: ChoiceAttributesArguments) {
  return (target: FormDtoBase, key: string) => {
    const formMetadata: FieldAttributes[] =
      Reflect.getMetadata(FORM_METADATA_TOKEN, target.constructor) || [];

    let fieldWithMissingAttributes =
      FormDecoratorHelper.generateFieldMissingAttributes<ChoiceAttributes>(
        key,
        attributes,
        formMetadata.length,
        'select',
      );

    if (
      attributes.type === FieldsChoice.RADIO ||
      attributes.type === FieldsChoice.CHECKBOX
    ) {
      fieldWithMissingAttributes =
        FormDecoratorHelper.generateInputChoiceMissingAttributes(
          fieldWithMissingAttributes,
        );
    }

    const finalAttributes =
      FormDecoratorHelper.handleRequiredField<ChoiceAttributes>(
        fieldWithMissingAttributes,
      );

    formMetadata.push(finalAttributes);

    Reflect.defineMetadata(
      FORM_METADATA_TOKEN,
      formMetadata,
      target.constructor,
    );
  };
}
