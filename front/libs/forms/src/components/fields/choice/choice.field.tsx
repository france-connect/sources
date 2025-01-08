import type { FieldValidator } from 'final-form';
import React from 'react';
import { Field, useField } from 'react-final-form';

import type { FieldTypes } from '../../../enums';
import { useFieldMeta } from '../../../hooks';
import type {
  ChoiceInterface,
  InputAttributesInterface,
  InputConfigInterface,
} from '../../../interfaces';
import { FieldsetElement, FieldsetLegendElement, MessageElement } from '../../elements';
import { ChoiceInput } from '../../inputs';

interface ChoiceFieldProps {
  type: FieldTypes.CHECKBOX | FieldTypes.RADIO;
  choices: ChoiceInterface[];
  validate?: FieldValidator<string> | undefined;
  config: InputConfigInterface & InputAttributesInterface<string>;
}

export const ChoiceField = React.memo(({ choices, config, type, validate }: ChoiceFieldProps) => {
  const { hint, label, name, required } = config;

  const { meta } = useField(name, {
    subscription: { error: true, touched: true },
  });

  const { errorMessage, hasError, isValid } = useFieldMeta<string>(meta);

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
      <MessageElement error={errorMessage} id={name} isValid={isValid} />
    </FieldsetElement>
  );
});

ChoiceField.displayName = 'ChoiceField';
