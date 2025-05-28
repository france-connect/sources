export class RedirectException extends Error {
  constructor(error: Error) {
    super();
    this.stack = error.stack;
    this.message = 'URL parameter is required or is invalid';
  }
}
