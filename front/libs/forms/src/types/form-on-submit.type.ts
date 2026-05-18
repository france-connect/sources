import type { FormApi, SubmissionErrors } from 'final-form';

import type { HttpClientDataInterface } from '@fc/http-client';

// @NOTE pickup from FormProps['onSubmit']
export type FormOnSubmitType<T extends HttpClientDataInterface> = (
  values: T,
  form: FormApi<T, Partial<T>>,
  callback?: (errors?: SubmissionErrors) => void,
) => SubmissionErrors | Promise<SubmissionErrors> | void;
