import 'reflect-metadata';

import { FormDtoBase } from '../../dto';
import { Fields } from '../../enums';
import { TextAttributesArguments } from '../../interfaces';
import { FORM_METADATA_TOKEN } from '../../tokens';
import { FormDecoratorHelper } from '../form-decorator.helper';

export function Text(attributes: TextAttributesArguments) {
  return (target: FormDtoBase, key: string) => {
    const formMetadata =
      Reflect.getMetadata(FORM_METADATA_TOKEN, target.constructor) || [];

    const finalAttributes = FormDecoratorHelper.generateTextMissingAttributes(
      key,
      attributes,
      formMetadata.length,
      Fields.SECTION,
    );

    formMetadata.push(finalAttributes);

    Reflect.defineMetadata(
      FORM_METADATA_TOKEN,
      formMetadata,
      target.constructor,
    );
  };
}
