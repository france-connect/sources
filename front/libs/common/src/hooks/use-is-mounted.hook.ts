import { useCallback, useEffect, useRef } from 'react';

/**
 *
 * Allow to check is a component has been mounted
 *
 * Usage
 * ------------------------
 * ```
 * const isMounted = useIsMounted();
 * useEffect(() => {
 *   if(isMounted()) {
 *     //
 *   }
 * });
 * ```
 */
export const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
};
