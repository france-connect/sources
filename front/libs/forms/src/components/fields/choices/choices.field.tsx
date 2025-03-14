import React from 'react';
import { Field, useField } from 'react-final-form';

import { useFieldMeta } from '../../../hooks';
import type { ChoiceInterface, FieldConfigInterface } from '../../../interfaces';
import { FieldsetElement, FieldsetLegendElement, MessageElement } from '../../elements';
import { ChoiceInput } from '../../inputs';

interface ChoicesFieldProps {
  choices: ChoiceInterface[];
  config: FieldConfigInterface;
}

export const ChoicesField = React.memo(({ choices, config }: ChoicesFieldProps) => {
  const { hint, label, name, required, type, validate } = config;

  const { meta } = useField(name);

  const { errorMessage, hasError, isValid } = useFieldMeta(meta);

  return (
    <FieldsetElement hasError={hasError} isValid={isValid} name={name}>
      <FieldsetLegendElement hint={hint} label={label} name={name} required={required} />
      {choices.map((choice) => (
        <Field
          key={`choices::${name}::choice::${choice.value}`}
          choice={choice}
          component={ChoiceInput}
          config={config}
          name={name}
          type={type}
          validate={validate}
          value={choice.value}
        />
      ))}
      <MessageElement
        dataTestId={`${name}-messages`}
        error={errorMessage}
        id={name}
        isValid={isValid}
      />
    </FieldsetElement>
  );
});

ChoicesField.displayName = 'ChoicesField';
