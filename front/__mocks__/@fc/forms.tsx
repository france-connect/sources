export const FieldsetElement = jest.fn(() => <div data-mockid="FieldsetElement" />);

export const FieldsetLegendElement = jest.fn(() => <div data-mockid="FieldsetLegendElement" />);

export const GroupElement = jest.fn(() => <div data-mockid="GroupElement" />);

export const LabelElement = jest.fn(() => <div data-mockid="LabelElement" />);

export const MessageElement = jest.fn(() => <div data-mockid="MessageElement" />);

export const FormComponent = jest.fn(() => <div data-mockid="FormComponent" />);

export const useFieldLabel = jest.fn();

export const InputField = jest.fn(() => <div data-mockid="InputField" />);

export const ChoiceField = jest.fn(() => <div data-mockid="ChoiceField" />);

export const SelectField = jest.fn(() => <div data-mockid="SelectField" />);

export const TextInput = jest.fn(() => <div data-mockid="TextInput" />);

export const HiddenInput = jest.fn(() => <div data-mockid="HiddenInput" />);

export const FieldTypes = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
};

export const ComponentTypes = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
};

export const UNKNOWN_FORM_ERROR = { 'FINAL_FORM/form-error': 'Form.FORM_ERROR' };
