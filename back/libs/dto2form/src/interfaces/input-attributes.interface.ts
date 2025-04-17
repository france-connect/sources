import {
  FieldAttributes,
  FieldAttributesArguments,
} from './field-attributes.interface';

// Kept to prevent re-typing everything in the future if we need to add more parameters
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputAttributesArguments extends FieldAttributesArguments {}

// Kept to prevent re-typing everything in the future if we need to add more parameters
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputAttributes extends FieldAttributes {}
