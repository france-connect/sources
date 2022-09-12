/* istanbul ignore file */

// Declarative code
export class UnknownConfigurationNameError extends Error {
  constructor(paths: string) {
    const msg = `Asked unknown configuration: <${paths}>`;
    super(msg);
  }
}
