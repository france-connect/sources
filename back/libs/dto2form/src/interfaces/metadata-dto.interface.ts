import { FieldAttributesArguments } from './field-attributes.interface';
import { FieldValidator } from './field-validator.interface';

export type ValidatorType = FieldValidator | FieldValidator[];

export interface MetadataDtoInterface
  extends Omit<FieldAttributesArguments, 'validators'> {
  name: string;
  validators: ValidatorType[];
}

export interface MetadataDtoTranslationInterface extends MetadataDtoInterface {
  label: string;
  hint?: string;
}
