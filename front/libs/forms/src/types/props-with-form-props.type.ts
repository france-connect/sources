import type { SubmissionErrors } from 'final-form';

import type { HttpClientDataInterface } from '@fc/http-client';

export type PropsWithFormPropsType<T extends HttpClientDataInterface> = {
  onSubmit: (values: T) => Promise<SubmissionErrors>;
  onValidate: (values: T) => SubmissionErrors;
};
