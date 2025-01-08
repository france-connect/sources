export interface MetadataDtoValidatorsInterface {
  name: string;
  errorLabel: string;
  validationArgs: string[];
}

export interface MetadataDtoValidateIfInterface {
  name: string;
  ruleArgs: string[];
}

export interface MetadataDtoInterface {
  required: boolean;
  order: number;
  validators: MetadataDtoValidatorsInterface[];
  validateIf: MetadataDtoValidateIfInterface[];
  type: string;
  name: string;
  label: string;
}
