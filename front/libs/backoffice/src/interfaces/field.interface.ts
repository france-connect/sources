/* istanbul ignore file */

// declarative file
export interface Field {
  name: string;
  // @NOTE le initialValue est un argument provenant de la lib react-final-Form
  // son typage de base est `any`, notre wrapper est donc obligé d'hérité de ce type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: any;
}

export interface FieldBoolNode {
  active: string;
  inactive: string;
}

export interface FieldOptions {
  disabled?: boolean;
  className?: string;
  rtl?: boolean;
  label?: string | Function;
}
