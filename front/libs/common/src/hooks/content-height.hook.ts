import { useLayoutEffect, useRef, useState } from 'react';

export const useContentHeight = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const clientHeight = contentRef.current?.clientHeight ?? 0;
    setContentHeight(clientHeight);
  }, []);

  return { contentHeight, contentRef };
};
