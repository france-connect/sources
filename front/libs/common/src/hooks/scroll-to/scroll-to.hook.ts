import { useCallback } from 'react';

export const useScrollTo = () => {
  // @TODO implement x,y position
  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  return { scrollToTop };
};
