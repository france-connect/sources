import type { FieldTypes } from '../enums';
import type { ChoiceInterface } from '../interfaces';
import type { PropsWithInputConfigType } from './props-with-input-config.type';

export type PropsWithInputChoiceType = {
  type: FieldTypes.RADIO | FieldTypes.CHECKBOX;
  choice: ChoiceInterface;
} & PropsWithInputConfigType;
