import React from 'react';
import { Field } from 'react-final-form';

import type { FieldConfigInterface } from '../../../interfaces';
import { TextAreaInput } from '../../inputs/textarea';

interface TextAreaFieldProps {
  config: FieldConfigInterface;
}

export const TextAreaField = React.memo(({ config }: TextAreaFieldProps) => {
  const { name, type, validate, ...rest } = config;

  return (
    <Field component={TextAreaInput} config={rest} name={name} type={type} validate={validate} />
  );
});

TextAreaField.displayName = 'TextAreaField';
