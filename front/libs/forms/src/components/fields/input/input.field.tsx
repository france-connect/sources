import React from 'react';
import { Field } from 'react-final-form';

import type { FieldConfigInterface } from '../../../interfaces';
import { TextInput } from '../../inputs';

interface InputFieldProps {
  config: FieldConfigInterface;
}

export const InputField = React.memo(({ config }: InputFieldProps) => {
  const { name, type, validate, ...rest } = config;

  return <Field component={TextInput} config={rest} name={name} type={type} validate={validate} />;
});

InputField.displayName = 'InputField';
