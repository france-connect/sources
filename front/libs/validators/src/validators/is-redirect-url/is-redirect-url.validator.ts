import validatorjs from 'validator';

import { HttpProtocols } from '@fc/common';

export const isRedirectURL = (value: string): boolean =>
  validatorjs.isURL(value, {
    protocols: [HttpProtocols.HTTP, HttpProtocols.HTTPS],
    // validatorjs naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
    // validatorjs naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_tld: false,
  });
