import type * as CSS from 'csstype';

import { useContentHeight } from '@fc/common';

export const useAccordion = (isOpened: boolean) => {
  const { contentHeight, contentRef } = useContentHeight();

  if (!contentRef.current) {
    return {
      contentRef,
      contentStyle: {
        // DSFR classname
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--collapse': '-99999px',
        // DSFR classname
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '--collapse-max-height': '0',
      } as CSS.DSFRCustomProperties,
    };
  }

  const height = `-${contentHeight}px`;
  const maxHeight = isOpened ? 'none' : '0';
  return {
    contentRef,
    contentStyle: {
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse': height,
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--collapse-max-height': maxHeight,
    } as CSS.DSFRCustomProperties,
  };
};
