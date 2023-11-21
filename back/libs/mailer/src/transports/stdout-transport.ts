import { LoggerService } from '@fc/logger-legacy';

import { MailOptions, Transport } from '../interfaces';

export class StdoutTransport implements Transport {
  constructor(private readonly logger: LoggerService) {}

  // Actually return a promise
  // eslint-disable-next-line require-await
  async send(params: MailOptions): Promise<unknown> {
    this.logger.debug(
      `Printing mail to console: ${JSON.stringify(params, null, 2)}`,
    );

    this.logger.trace({
      text: 'Printing mail to console',
      params,
    });

    return Promise.resolve(true);
  }
}
