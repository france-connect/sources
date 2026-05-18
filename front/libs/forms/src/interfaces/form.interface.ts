import type { Decorator } from 'final-form';

import type { HeadingTag } from '@fc/common';
import type { HttpClientDataInterface } from '@fc/http-client';

import type { FormOnSubmitType, FormValidateType } from '../types';
import type { FormActionsInterface } from './form-actions.interface';

export interface FormConfigInterface {
  description?: string;
  id: string;
  title?: string;
  titleHeading?: HeadingTag;
  mentions?: string;
  validateOnFieldChange?: boolean;
  validateOnSubmit?: boolean;
  showFieldValidationMessage?: boolean;
  noRequired?: boolean;
  scrollTopOnSubmit?: boolean;
  actions?: FormActionsInterface[];
}

export interface FormInterface<T extends HttpClientDataInterface> {
  initialValues?: T;
  config: FormConfigInterface;
  decorators?: Decorator<T, Partial<T>>[];
  onValidate?: FormValidateType<T>;
  onSubmit: FormOnSubmitType<T>;
  onPreSubmit?: (values: T) => Promise<T>;
  onPostSubmit?: FormOnSubmitType<T>;
}
