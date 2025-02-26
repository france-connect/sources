import 'reflect-metadata';

import { FormDtoBase } from '../../dto';
import {
  FieldAttributes,
  SelectAttributes,
  SelectAttributesArguments,
} from '../../interfaces';
import { FORM_METADATA_TOKEN } from '../../tokens';
import { FormDecoratorHelper } from '../form-decorator.helper';

export function Select(attributes: SelectAttributesArguments) {
  return (target: FormDtoBase, key: string) => {
    const formMetadata: FieldAttributes[] =
      Reflect.getMetadata(FORM_METADATA_TOKEN, target.constructor) || [];

    const fieldWithMissingAttributes =
      FormDecoratorHelper.generateFieldMissingAttributes<SelectAttributes>(
        key,
        attributes,
        formMetadata.length,
        'select',
      );

    const finalAttributes =
      FormDecoratorHelper.handleRequiredField<SelectAttributes>(
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
