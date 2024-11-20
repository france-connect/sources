/* istanbul ignore file */

// Declarative file
export class ExceptionCaughtEvent {
  constructor(
    public readonly exception: any,
    public readonly context: any,
  ) {}
}
