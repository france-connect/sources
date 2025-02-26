import React from 'react';
import { Field } from 'react-final-form';

import type { ChoiceInterface, FieldConfigInterface } from '../../../interfaces';
import { SelectInput } from '../../inputs';

interface SelectFieldProps {
  choices: ChoiceInterface[];
  config: FieldConfigInterface;
}

export const SelectField = React.memo(({ choices, config }: SelectFieldProps) => {
  const { name, type, validate, ...rest } = config;

  return (
    <Field
      choices={choices}
      component={SelectInput}
      config={rest}
      name={name}
      subscription={{ error: true, touched: true, value: true }}
      type={type}
      validate={validate}
    />
  );
});

SelectField.displayName = 'SelectField';
