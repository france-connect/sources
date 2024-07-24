/* istanbul ignore file */

// Declarative code
export class NotWrappedIntoProviderException extends Error {
  public message = 'useStylesContext must be wrapped into a StylesProvider';
}
