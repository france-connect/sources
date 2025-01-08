export class HasAlreadyBeenInitialized extends Error {
  public readonly message = 'Config service has already been initialized !';
}
