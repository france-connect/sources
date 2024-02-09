import { LoggerService } from '@fc/logger';

import { MailOptions, Transport } from '../interfaces';

export class StdoutTransport implements Transport {
  constructor(private readonly logger: LoggerService) {}

  // Actually return a promise
  // eslint-disable-next-line require-await
  async send(params: MailOptions): Promise<unknown> {
    this.logger.info(params, 'Printing mail to console');

    return Promise.resolve(true);
  }
}
