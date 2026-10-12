import { useLayoutEffect, useRef, useState } from 'react';

export const useContentHeight = <T extends HTMLElement = HTMLDivElement>({
  offset,
}: {
  offset?: number;
} = {}) => {
  const contentRef = useRef<T>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const elt = contentRef.current;
      const { height } = elt.getBoundingClientRect();
      const value = height + (offset ?? 0);
      setContentHeight(value);
    }
  }, [offset]);

  return { contentHeight, contentRef };
};
