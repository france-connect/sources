import has from 'lodash.has';

import { t } from '@fc/i18n';

import { Validators } from '../../enums';
import { buildValidator, composeValidators } from '../../helpers';
import type { FieldValidator } from '../../interfaces';
import { isRequired } from '../../validators';

export const useFieldValidate = ({
  disabled = false,
  required,
  validators,
}: {
  disabled?: boolean;
  required: boolean;
  validators: FieldValidator[];
}) => {
  const funcs = validators
    .filter((v) => !!has(Validators, v.name))
    .map((v) => buildValidator(v, !required));

  // @NOTE
  // if the field is required
  // the first validator to throw will be the submit validator
  if (required) {
    const msg = t('Form.message.required');
    funcs.unshift(isRequired(msg));
  }

  const shouldValidate = !disabled && funcs;
  if (!shouldValidate) {
    // @NOTE if the field is disabled
    // we don't need to validate it
    return undefined;
  }

  return composeValidators(...funcs);
};
