import React from 'react';
import { Field, useField } from 'react-final-form';

import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { ChoiceInterface, FieldConfigInterface } from '../../../interfaces';
import { FieldsetElement, FieldsetLegendElement, MessagesElement } from '../../elements';
import { ChoiceInput } from '../../inputs';

interface ChoicesFieldProps {
  choices: ChoiceInterface[];
  config: FieldConfigInterface;
}

export const ChoicesField = React.memo(({ choices, config }: ChoicesFieldProps) => {
  const { hint, label, messages, name, required, seeAlso, type, validate } = config;

  const { meta } = useField(name);

  const { errorsList, hasError, isValid } = useFieldMeta(meta);

  const fieldMessages = useFieldMessages({ errorsList, isValid, messages });
  const hasMessages = fieldMessages && fieldMessages.length > 0;

  return (
    <FieldsetElement hasError={hasError} isValid={isValid} name={name}>
      <FieldsetLegendElement
        hint={hint}
        label={label}
        name={name}
        required={required}
        seeAlso={seeAlso}
      />
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
      {hasMessages && (
        <MessagesElement dataTestId={`${name}-messages`} id={name} messages={fieldMessages} />
      )}
    </FieldsetElement>
  );
});

ChoicesField.displayName = 'ChoicesField';
