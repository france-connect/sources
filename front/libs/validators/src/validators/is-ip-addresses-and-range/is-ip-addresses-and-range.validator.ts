import validatorjs from 'validator';

export const isIpAddressesAndRange = (value: string): boolean =>
  validatorjs.isIP(value) || validatorjs.isIPRange(value);
