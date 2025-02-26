import get from 'lodash.get';

import { Validators } from '../../enums';
import type { FieldValidatorInterface } from '../../interfaces';

export const buildValidator = (
  fieldValidator: FieldValidatorInterface,
  allowEmptyValue: boolean = true,
) => {
  const { name, validationArgs } = fieldValidator;

  const validator = get(Validators, name);

  return (msg: string) => (fieldValue: string) => {
    const cleanValue = fieldValue && fieldValue.trim();

    const isOptionalFieldWithoutValue = allowEmptyValue && !cleanValue;
    if (isOptionalFieldWithoutValue) {
      // @NOTE if the field is optional and empty
      // we don't need to validate it
      // return undefined means no error
      return undefined;
    }

    let isValid = false;
    const validatorOptions = validationArgs || [];

    if (name === 'matches') {
      const str = validatorOptions[0] as string;
      const regex = new RegExp(str);
      isValid = validator(cleanValue, regex);
    } else {
      isValid = validator(cleanValue, ...validatorOptions);
    }

    return isValid ? undefined : msg;
  };
};
