import type { Decorator, SubmissionErrors, ValidationErrors } from 'final-form';

import type { HeadingTag } from '@fc/common';

export interface FormConfigInterface {
  description?: string;
  id: string;
  title?: string;
  titleHeading?: HeadingTag;
  mentions?: string;
}

export interface FormInterface<T> {
  initialValues?: T;
  config: FormConfigInterface;
  noRequired?: boolean;
  scrollTopOnSubmit?: boolean;
  decorators?: Decorator<T, Partial<T>>[];
  onValidate?: (values: T) => ValidationErrors | Promise<ValidationErrors>;
  onSubmit: (values: T) => SubmissionErrors | Promise<SubmissionErrors> | void;
  submitLabel?: string;
}
