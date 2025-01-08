export class RouterException extends Error {
  constructor(error: Error) {
    super();
    this.stack = error.stack;
    this.message = error.message;
  }
}
