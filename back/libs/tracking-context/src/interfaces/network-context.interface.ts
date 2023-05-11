/* istanbul ignore file */

// Declarative file
export interface NetworkContextInterface {
  address: string;
  // logs filter and analyses need this format
  // eslint-disable-next-line @typescript-eslint/naming-convention
  original_addresses?: string;
  port: string;
}
