/* istanbul ignore file */

// declarative file
import { HeadingTag } from '@fc/common';

export interface AccordionGroupItemInterface {
  id: string;
  title: string;
  element: React.ReactElement;
  headingClassname?: string;
  heading?: HeadingTag;
  titleClassname?: string;
  className?: string;
}
