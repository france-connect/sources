import type { PropsWithChildren } from 'react';
import { Form } from 'react-final-form';

import type { FormPropsInterface } from '../../interfaces';
import { FormWrapperComponent } from './form-wrapper/form-wrapper.component';

export function FormComponent<T = unknown>({
  children,
  config,
  decorators,
  initialValues,
  noRequired = false,
  onSubmit,
  onValidate,
  scrollTopOnSubmit = true,
}: FormPropsInterface<T> & PropsWithChildren) {
  return (
    <Form<T>
      config={config}
      decorators={decorators}
      initialValues={initialValues}
      noRequired={noRequired}
      scrollTopOnSubmit={scrollTopOnSubmit}
      validate={onValidate}
      onSubmit={onSubmit}>
      {(props) =>
        FormWrapperComponent({ ...props, children, config, noRequired, scrollTopOnSubmit })
      }
    </Form>
  );
}
