import { useLayoutEffect, useRef, useState } from 'react';

export const useContentHeight = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const { clientHeight } = contentRef.current;
      setContentHeight(clientHeight);
    }
  }, []);

  return { contentHeight, contentRef };
};
