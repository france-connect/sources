import { FieldsChoice } from '../enums/';
import {
  FieldAttributes,
  FieldAttributesArguments,
} from './field-attributes.interface';

export interface OptionsAttributesInterface {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ChoiceAttributesArguments extends FieldAttributesArguments {
  /*
   ** Should at least have one option
   */
  options: [OptionsAttributesInterface, ...OptionsAttributesInterface[]];
  type: FieldsChoice;
}

export interface ChoiceAttributes extends FieldAttributes {
  /*
   ** Should at least have one option
   */
  options: [OptionsAttributesInterface, ...OptionsAttributesInterface[]];
}
