import { TrackedEventContextInterface } from '@fc/tracking';

import { TrackingMissingNetworkContextException } from '../exceptions';
import { NetworkContextInterface } from '../interfaces';

export function extractNetworkInfoFromHeaders(
  context: TrackedEventContextInterface,
): NetworkContextInterface {
  if (!context.req?.headers) {
    throw new TrackingMissingNetworkContextException();
  }

  const address = context.req.headers['x-forwarded-for'];
  const port = context.req.headers['x-forwarded-source-port'];
  // logs filter and analyses need this format
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const original_addresses = context.req.headers['x-forwarded-for-original'];

  // logs filter and analyses need this format
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { address, port, original_addresses };
}
