export interface MetadataDtoValidatorsInterface {
  name: string;
  errorLabel: string;
  validationArgs: unknown[];
}

export interface MetadataDtoValidateIfInterface {
  name: string;
  ruleArgs: string[];
}

export type ValidatorType = (
  | MetadataDtoValidatorsInterface
  | MetadataDtoValidatorsInterface[]
)[];

export interface MetadataDtoInterface {
  required: boolean;
  readonly: boolean;
  array: boolean;
  order: number;
  validators: ValidatorType;
  validateIf: MetadataDtoValidateIfInterface[];
  type: string;
  name: string;
  label?: string;
  hint?: string;
}
