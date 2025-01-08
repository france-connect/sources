import type { FieldTypes } from '@fc/forms';

import type { FieldAttributes, FieldAttributesArguments } from './field-attributes.interface';

export interface SelectAttributesOption {
  label: string;
  value: string;
}

export interface SelectAttributes extends FieldAttributes {
  type: FieldTypes.SELECT;
  options: SelectAttributesOption[];
}

export interface SelectAttributesArguments extends FieldAttributesArguments {
  options: SelectAttributesOption[];
}
