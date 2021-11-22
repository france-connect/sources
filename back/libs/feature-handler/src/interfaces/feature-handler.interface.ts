/* istanbul ignore file */

// Declarative code

/**
 * The class that implements FeatureHandler
 * must contains a 'handle' function
 */
export interface IFeatureHandler<T = unknown, Opt = unknown> {
  handle(arg?: Opt): Promise<T>;
}
