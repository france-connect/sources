import 'reflect-metadata';

import { FormDtoBase } from '../../dto';
import {
  FieldAttributes,
  InputAttributes,
  InputAttributesArguments,
} from '../../interfaces';
import { FORM_METADATA_TOKEN } from '../../tokens';
import { FormDecoratorHelper } from '../form-decorator.helper';

export function Input(attributes: InputAttributesArguments) {
  return (target: FormDtoBase, key: string) => {
    const formMetadata: FieldAttributes[] =
      Reflect.getMetadata(FORM_METADATA_TOKEN, target.constructor) || [];

    const finalAttributes =
      FormDecoratorHelper.generateFieldMissingAttributes<InputAttributes>(
        key,
        attributes,
        formMetadata.length,
        'text',
      );

    formMetadata.push(finalAttributes);

    Reflect.defineMetadata(
      FORM_METADATA_TOKEN,
      formMetadata,
      target.constructor,
    );
  };
}
