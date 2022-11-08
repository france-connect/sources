import { useCallback } from 'react';

export const useScrollTo = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  return { scrollToTop };
};
