import validatorjs from 'validator';

export const isWebsiteURL = (value: string): boolean =>
  validatorjs.isURL(value, {
    protocols: ['https'],
    // validatorjs naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
  });
