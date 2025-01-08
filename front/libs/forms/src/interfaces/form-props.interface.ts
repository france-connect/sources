import type { Decorator, SubmissionErrors, ValidationErrors } from 'final-form';

import type { FormConfigInterface } from './form-props-config.interface';

export interface FormPropsInterface<T> {
  initialValues?: T;
  config: FormConfigInterface;
  noRequired?: boolean;
  scrollTopOnSubmit?: boolean;
  decorators?: Decorator<T, Partial<T>>[];
  onValidate?: (values: T) => ValidationErrors | Promise<ValidationErrors>;
  onSubmit: (values: T) => SubmissionErrors | Promise<SubmissionErrors> | void;
}
