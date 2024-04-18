/* istanbul ignore file */

// declarative file
import type { HeadingTag } from '@fc/common';

export interface AccordionGroupItemInterface {
  id: string;
  title: string;
  element: React.ReactElement;
  headingClassname?: string;
  heading?: HeadingTag;
  titleClassname?: string;
  className?: string;
}
