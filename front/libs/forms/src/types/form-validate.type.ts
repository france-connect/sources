import type { ValidationErrors } from 'final-form';

import type { HttpClientDataInterface } from '@fc/http-client';

// @NOTE pickup from FormProps['validate']
export type FormValidateType<T extends HttpClientDataInterface> = (
  values: T,
) => ValidationErrors | Promise<ValidationErrors>;
