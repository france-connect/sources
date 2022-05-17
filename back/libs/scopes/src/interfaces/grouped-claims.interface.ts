/* istanbul ignore file */

// Declarative code
import { Providers } from '../enum';

export type IGroupedClaims = Record<
  Providers,
  { label: string; claims: string[] }
>;
