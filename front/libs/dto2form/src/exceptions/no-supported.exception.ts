export class NoSupportedException extends Error {
  constructor(type: string) {
    super(`Unsupported field type: ${type}`);
  }
}
