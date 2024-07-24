import * as deepFreeze from 'deep-freeze';

import { validateDtoSync } from '@fc/common';

import { FieldDto, FormDtoBase } from '../dto';
import { FieldAttributes } from '../interfaces';
import { FORM_METADATA_TOKEN } from '../tokens';
import { FormDecoratorHelper } from './form-decorator.helper';

export function Form(): ClassDecorator {
  return (constructor: FormDtoBase) => {
    FormDecoratorHelper.checkCompatibility(constructor);

    const metadata: FieldAttributes[] = Reflect.getMetadata(
      FORM_METADATA_TOKEN,
      constructor,
    );

    const allErrors = metadata
      .map((field) => {
        const errors = validateDtoSync(field, FieldDto, {});

        return errors;
      })
      .filter((errors) => errors.length > 0);

    if (allErrors.length > 0) {
      throw new Error(JSON.stringify(allErrors));
    }

    /**
     * This will prevent tampering with the metadata since it is not supposed
     * to change after this decorator has run.
     */
    Reflect.defineMetadata(
      FORM_METADATA_TOKEN,
      deepFreeze(metadata),
      constructor,
    );
  };
}
