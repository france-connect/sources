/**
 * :warning: Do not remove "any" type from the following types.
 * It is required to support any function signature.
 * It is safer than "Function" type and it needs to match any function signature.
 *
 * @todo Add "eslint-disable-next-line @typescript-eslint/no-explicit-any" here and remove this comment
 * when coding FC-2173
 */

import { Asyncify } from 'type-fest';

// You should still use specific types when possible.
export type FunctionSafe = (...args: any[]) => any;
// You should still use specific types when possible.
export type AsyncFunctionSafe = Asyncify<FunctionSafe>;
