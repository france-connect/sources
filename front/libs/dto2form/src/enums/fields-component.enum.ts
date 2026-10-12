import {
  ArrayField,
  ChoicesField,
  ConsentField,
  FieldTypes,
  InputField,
  SelectField,
  TextAreaField,
} from '@fc/forms';

export const FieldsCommponentMap = {
  [FieldTypes.ARRAY]: ArrayField,
  [FieldTypes.CHECKBOX]: ChoicesField,
  [FieldTypes.CONSENT]: ConsentField,
  [FieldTypes.DATE]: InputField,
  [FieldTypes.EMAIL]: InputField,
  [FieldTypes.HIDDEN]: InputField,
  [FieldTypes.NUMBER]: InputField,
  [FieldTypes.RADIO]: ChoicesField,
  [FieldTypes.SELECT]: SelectField,
  [FieldTypes.TEXT]: InputField,
  [FieldTypes.TEXTAREA]: TextAreaField,
};
