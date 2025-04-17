import finalFormArrays from 'final-form-arrays';
import type { PropsWithChildren } from 'react';
import type { FormRenderProps } from 'react-final-form';
import { Form } from 'react-final-form';

import type { FormInterface } from '../../interfaces';
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
  submitLabel = undefined,
}: FormInterface<T> & PropsWithChildren) {
  return (
    <Form<T>
      config={config}
      decorators={decorators}
      initialValues={initialValues}
      mutators={{ ...finalFormArrays }}
      noRequired={noRequired}
      scrollTopOnSubmit={scrollTopOnSubmit}
      validate={onValidate}
      onSubmit={onSubmit}>
      {(props: FormRenderProps<T>) =>
        FormWrapperComponent({
          ...props,
          children,
          config,
          noRequired,
          scrollTopOnSubmit,
          submitLabel,
        })
      }
    </Form>
  );
}
