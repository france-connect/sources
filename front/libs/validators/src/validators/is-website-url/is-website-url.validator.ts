import validatorjs from 'validator';

import { HttpProtocols } from '@fc/common';

export const isWebsiteURL = (value: string): boolean =>
  validatorjs.isURL(value, {
    protocols: [HttpProtocols.HTTPS],
    // validatorjs naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    require_protocol: true,
  });
