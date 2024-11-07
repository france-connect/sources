/* istanbul ignore file */

// Declarative code
export class RedirectException extends Error {
  public message = 'URL parameter is required or is invalid';
}
