import validator from 'validator';

import {
  isFilled,
  isIpAddressesAndRange,
  isRedirectURL,
  isSignedResponseAlg,
  isString,
  isWebsiteURL,
} from '@fc/validators';

export const Validators = {
  ...validator,
  isFilled,
  isIpAddressesAndRange,
  isRedirectURL,
  isSignedResponseAlg,
  isString,
  isWebsiteURL,
};
