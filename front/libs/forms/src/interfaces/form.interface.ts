import type { Decorator, SubmissionErrors, ValidationErrors } from 'final-form';

import type { HeadingTag } from '@fc/common';
import type { HttpClientDataInterface } from '@fc/http-client';

export type SubmitHandlerType<T extends HttpClientDataInterface> = (
  values: T,
) => SubmissionErrors | Promise<SubmissionErrors>;

export type ValidateHandlerType<T extends HttpClientDataInterface> = (
  values: T,
) => ValidationErrors | Promise<ValidationErrors>;

export type PreSubmitHandlerType<T> = (values: T) => Promise<T>;
export type PostSubmitHandlerType<T> = (values: T) => Promise<SubmissionErrors> | void;

export interface FormConfigInterface {
  description?: string;
  id: string;
  title?: string;
  titleHeading?: HeadingTag;
  mentions?: string;
  validateOnFieldChange?: boolean;
  validateOnSubmit?: boolean;
  showFieldValidationMessage?: boolean;
}

export interface FormInterface<T extends HttpClientDataInterface> {
  initialValues?: T;
  config: FormConfigInterface;
  noRequired?: boolean;
  scrollTopOnSubmit?: boolean;
  decorators?: Decorator<T, Partial<T>>[];
  onValidate?: ValidateHandlerType<T>;
  onSubmit: SubmitHandlerType<T>;
  onPreSubmit?: PreSubmitHandlerType<T>;
  onPostSubmit?: PostSubmitHandlerType<T>;
  submitLabel?: string;
}
