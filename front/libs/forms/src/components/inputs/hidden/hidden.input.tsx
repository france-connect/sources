import React from 'react';
import { Field } from 'react-final-form';

import { ComponentTypes, FieldTypes } from '../../../enums';

interface HiddenInputProps {
  name: string;
}

export const HiddenInput = React.memo(({ name }: HiddenInputProps) => (
  <Field component={ComponentTypes.INPUT} name={name} type={FieldTypes.HIDDEN} />
));

HiddenInput.displayName = 'HiddenInput';
