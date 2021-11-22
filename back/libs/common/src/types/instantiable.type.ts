/* istanbul ignore file */

// Declarative code
export type Instantiable<T = unknown> = { new (...args: unknown[]): T };
