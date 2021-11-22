/* istanbul ignore file */

// Declarative code
/**
 * This permissive interface allow us to aknowledge the intention
 * of "business logging" something.
 *
 * Since we have to explicitly implement the interface to do so.
 */
export abstract class ILoggerBusinessEvent {
  readonly category: string;
  readonly event: string;
  readonly ip: string;
}
