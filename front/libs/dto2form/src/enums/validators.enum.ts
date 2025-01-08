import validator from 'validator';

import { isString } from '@fc/common';

export const Validators = {
  ...validator,
  isString,
};
