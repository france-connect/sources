import finalFormArrays from 'final-form-arrays';
import type { PropsWithChildren } from 'react';
import type { FormRenderProps } from 'react-final-form';
import { Form } from 'react-final-form';

import type { HttpClientDataInterface } from '@fc/http-client';

import type { FormInterface } from '../../interfaces';
import { FormWrapperComponent } from './form-wrapper/form-wrapper.component';

export function FormComponent<T extends HttpClientDataInterface>({
  children,
  config,
  decorators,
  initialValues,
  onSubmit,
  onValidate,
}: FormInterface<T> & Required<PropsWithChildren>) {
  return (
    <Form<T>
      decorators={decorators}
      initialValues={initialValues}
      mutators={{ ...finalFormArrays }}
      validate={onValidate}
      onSubmit={onSubmit}>
      {(props: FormRenderProps<T>) => (
        // @NOTE We need to spread props here
        // to pass all the necessary props to the FormWrapperComponent
        // such as handleSubmit, form, values, etc.
        // eslint-disable-next-line react/jsx-props-no-spreading
        <FormWrapperComponent {...props} config={config}>
          {children}
        </FormWrapperComponent>
      )}
    </Form>
  );
}
