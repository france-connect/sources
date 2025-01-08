import get from 'lodash.get';

import { Validators } from '../../enums';
import type { FieldValidator } from '../../interfaces';

export const buildValidator = (fieldValidator: FieldValidator, allowEmpty: boolean = true) => {
  const { errorLabel, name, validationArgs } = fieldValidator;

  function validateFunc(fieldValue: string | string[]) {
    const dirtyValues = !Array.isArray(fieldValue) ? [fieldValue] : fieldValue;
    const values = dirtyValues.map((v) => (typeof v === 'string' ? v.trim() : v)).filter((v) => v);

    if (allowEmpty && (!values || !values.length)) {
      return undefined;
    }

    const errorMessage = errorLabel;
    const options = validationArgs || [];

    const validator = get(Validators, name);

    const isValueValid = values.every((v) => {
      let valid = false;
      if (name === 'matches') {
        const str = options[0] as string;
        const regex = new RegExp(str);
        valid = validator(v, regex);
      } else {
        valid = validator(v, ...options);
      }
      return valid;
    });
    return isValueValid ? undefined : errorMessage;
  }

  return validateFunc;
};
