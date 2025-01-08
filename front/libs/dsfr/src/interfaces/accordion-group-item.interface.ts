import type { HeadingTag, PropsWithClassName } from '@fc/common';

export interface AccordionGroupItemInterface extends PropsWithClassName {
  id: string;
  title: string;
  element: React.ReactElement;
  headingClassname?: string;
  heading?: HeadingTag;
  titleClassname?: string;
}
