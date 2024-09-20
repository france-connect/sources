import type { Context } from 'react';
import { useContext } from 'react';

import { SafeContextException } from '../../exceptions/safe-context.exception';

// @TODO
// replace all React.useContext with useSafeContext
export function useSafeContext<T>(TheContext: Context<T | undefined>) {
  const context = useContext(TheContext);
  if (context === undefined) {
    throw new SafeContextException();
  }
  return context as T;
}
