import {
  FieldAttributes,
  FieldAttributesArguments,
} from './field-attributes.interface';

export interface SelectAttributesOption {
  label: string;
  value: string;
}

export interface SelectAttributes extends FieldAttributes {
  type: 'select';
  options: SelectAttributesOption[];
}

export interface SelectAttributesArguments extends FieldAttributesArguments {
  options: SelectAttributesOption[];
}
