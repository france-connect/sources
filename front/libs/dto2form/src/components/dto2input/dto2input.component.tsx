import React from 'react';

import { useSafeContext } from '@fc/common';
import { Sizes } from '@fc/dsfr';
import { ArrayField, FormConfigContext } from '@fc/forms';

import { FieldsCommponentMap } from '../../enums';
import { useFieldValidate } from '../../hooks';
import type { FieldAttributes } from '../../interfaces';

interface DTO2InputComponentProps {
  field: FieldAttributes;
}

export const DTO2InputComponent = React.memo(({ field }: DTO2InputComponentProps) => {
  // @NOTE Should we use the flag into the useFieldValidate hook ?
  // Or into fields subscription
  // @SEE https://final-form.org/docs/react-final-form/types/FieldProps#subscription
  const { validateOnFieldChange } = useSafeContext(FormConfigContext);

  const {
    array,
    disabled,
    hint,
    inline,
    label,
    maxChars,
    messages,
    name,
    options,
    readonly,
    required,
    seeAlso,
    type,
    validators,
    value,
  } = field;

  const validate = useFieldValidate({
    // @NOTE using a hook is performance issue ?
    // Should be moved to an helper instead of being computed at each render
    // Should it help when the validator is changing ?
    disabled,
    required,
    validators,
  });

  const choices = options || [];
  const validateFunc = validateOnFieldChange ? validate : undefined;

  const config = {
    hint,
    inline,
    label,
    maxChars,
    messages,
    name,
    readonly,
    required,
    seeAlso,
    size: Sizes.MEDIUM,
    type,
    validate: validateFunc,
    value,
  };

  // @TODO create a array field into FieldTypes
  // get the component using the same cas as others components
  const Component = array ? ArrayField : FieldsCommponentMap[type];

  return <Component choices={choices} config={config} />;
});

DTO2InputComponent.displayName = 'DTO2InputComponent';
