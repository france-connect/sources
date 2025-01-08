import React from 'react';

import { Sizes } from '@fc/dsfr';
import { ChoiceField, FieldTypes, InputField, SelectField } from '@fc/forms';

import { useFieldValidate } from '../../hooks';
import type { JSONFieldType } from '../../types';

interface DTO2FieldComponentProps {
  field: JSONFieldType;
}

export const DTO2FieldComponent = React.memo(({ field }: DTO2FieldComponentProps) => {
  const { disabled, required, validators } = field;
  const validate = useFieldValidate({
    disabled,
    required,
    validators,
  });

  const config = {
    clipboardDisabled: false,
    hint: field.placeholder,
    inline: true,
    label: field.label,
    maxChars: field.maxChars,
    name: field.name,
    required: field.required,
    size: Sizes.MEDIUM,
    value: field.value,
  };

  const { type } = field;
  const choices = field.options || [];

  const isSelectField = type === FieldTypes.SELECT;
  if (isSelectField) {
    return <SelectField choices={choices} config={config} validate={validate} />;
  }

  const isChoiceField = type === FieldTypes.RADIO || type === FieldTypes.CHECKBOX;
  if (isChoiceField) {
    return <ChoiceField choices={choices} config={config} type={type} validate={validate} />;
  }

  return <InputField config={config} type={type} validate={validate} />;
});

DTO2FieldComponent.displayName = 'DTO2FieldComponent';
