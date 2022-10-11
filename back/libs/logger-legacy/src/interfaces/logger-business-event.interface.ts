/* istanbul ignore file */

// Declarative code
/**
 * This permissive interface allow us to aknowledge the intention
 * of "business logging" something.
 *
 * Since we have to explicitly implement the interface to do so.
 */

export interface IUserNetworkInfo {
  address: string;
  // logs filter and analyses need this format
  // eslint-disable-next-line @typescript-eslint/naming-convention
  original_addresses: string;
  port: string;
}

export abstract class ILoggerBusinessEvent {
  readonly category: string;
  readonly event: string;
  readonly ip: string;
  readonly source: IUserNetworkInfo;
}
