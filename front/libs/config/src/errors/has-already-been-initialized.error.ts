/* istanbul ignore file */

// Declarative code
export class HasAlreadyBeenInitialized extends Error {
  public readonly message = 'Config service has already been initialized !';
}
