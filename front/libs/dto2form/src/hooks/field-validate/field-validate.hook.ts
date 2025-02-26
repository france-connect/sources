import has from 'lodash.has';

import { Validators } from '../../enums';
import { buildValidator, composeValidators } from '../../helpers';
import type { FieldValidatorInterface } from '../../interfaces';

export const useFieldValidate = ({
  disabled = false,
  required,
  validators,
}: {
  disabled?: boolean;
  required: boolean;
  validators: FieldValidatorInterface[];
}) => {
  const funcs = validators
    .filter((v) => !!has(Validators, v.name))
    .map((v) => {
      const msg = v.errorLabel;
      const func = buildValidator(v, !required);
      return func(msg);
    });

  const shouldNotUseValidation = disabled || !funcs || !funcs.length;
  if (shouldNotUseValidation) {
    // @NOTE if the field is disabled
    // we don't need to validate it
    return undefined;
  }

  return composeValidators(...funcs);
};
