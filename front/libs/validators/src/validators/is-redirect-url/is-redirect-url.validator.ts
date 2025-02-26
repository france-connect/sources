import validatorjs from 'validator';

export const isRedirectURL = (value: string): boolean =>
  validatorjs.isURL(value, {
    protocols: ['http', 'https'],
    // validatorjs naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
    // validatorjs naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_tld: false,
  });
