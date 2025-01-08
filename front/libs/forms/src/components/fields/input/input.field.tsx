import type { FieldValidator } from 'final-form';
import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { useClipboard } from '@fc/common';

import { FieldTypes } from '../../../enums';
import type { InputAttributesInterface, InputConfigInterface } from '../../../interfaces';
import { TextInput } from '../../inputs';
import { TextAreaInput } from '../../inputs/textarea';

interface InputFieldProps {
  type: FieldTypes;
  validate?: FieldValidator<string> | undefined;
  config: InputConfigInterface & InputAttributesInterface<string>;
}

export const InputField = React.memo(({ config, type, validate }: InputFieldProps) => {
  const { clipboardDisabled, format, name, ...rest } = config;

  const { onPaste } = useClipboard(!!clipboardDisabled);

  const component = useMemo(() => {
    switch (type) {
      case FieldTypes.TEXTAREA:
        return TextAreaInput;
      default:
        return TextInput;
    }
  }, [type]);

  return (
    <Field
      component={component}
      config={rest}
      format={format}
      name={name}
      subscription={{ error: true, touched: true, value: true }}
      type={type}
      validate={validate}
      onPaste={onPaste}
    />
  );
});

InputField.displayName = 'InputField';
