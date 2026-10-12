import React from 'react';
import { Field, useField } from 'react-final-form';

import { Strings } from '@fc/common';

import { FieldTypes } from '../../../enums';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldConfigInterface } from '../../../interfaces';
import { FieldsetElement, MessagesElement } from '../../elements';
import { ChoiceInput } from '../../inputs';

interface ConsentFieldProps {
  config: FieldConfigInterface<boolean>;
}

export const ConsentField = React.memo(({ config }: ConsentFieldProps) => {
  const { label, messages, name, required, validate } = config;

  const { meta } = useField(name);

  const { errorsList, hasError, isValid } = useFieldMeta(meta);

  const fieldMessages = useFieldMessages({ errorsList, isValid, messages });

  let choiceLabel = label;
  if (required) {
    choiceLabel = `${choiceLabel}${Strings.WHITE_SPACE}${Strings.ASTERISK}`;
  }

  return (
    <FieldsetElement hasError={hasError} isValid={isValid} name={name}>
      <Field
        // @TODO find a better way to handle the choice value
        choice={{ label: choiceLabel }}
        component={ChoiceInput}
        config={config}
        name={name}
        type={FieldTypes.CHECKBOX}
        validate={validate}
      />
      <MessagesElement id={name} messages={fieldMessages} />
    </FieldsetElement>
  );
});

ConsentField.displayName = 'ConsentField';
