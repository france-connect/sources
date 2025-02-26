import {
  FieldAttributes,
  FieldAttributesArguments,
} from './field-attributes.interface';

export interface SelectAttributesOption {
  label: string;
  value: string;
}

export interface SelectAttributesArguments extends FieldAttributesArguments {
  options: SelectAttributesOption[];
}

export interface SelectAttributes extends FieldAttributes {
  options: SelectAttributesOption[];
}
