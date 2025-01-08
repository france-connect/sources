import { useCallback } from 'react';

export const useScrollToElement = (classname: string) => {
  if (!classname || !classname.trim() || classname.indexOf('.') !== 0) {
    throw new Error('classname is required');
  }

  const scrollToElement = useCallback(() => {
    setTimeout(() => {
      const elt = document.querySelector(classname);
      // @TODO
      // fix HTML structure
      // scroll-to-element should not be depending on how many children
      const scrollable = elt?.parentElement?.parentElement;
      if (!scrollable) {
        return;
      }

      const behavior = 'smooth';
      const shouldUseScrollIntoView = !!document.documentElement.scrollIntoView;
      if (shouldUseScrollIntoView) {
        scrollable.scrollIntoView({ behavior });
      } else {
        const topPosition = scrollable.getBoundingClientRect().top;
        window.scrollBy({ behavior, left: 0, top: topPosition });
      }
    }, 200);
  }, [classname]);

  return { scrollToElement };
};
