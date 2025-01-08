import type { ChoiceInterface } from '../interfaces';
import type { PropsWithInputConfigType } from './props-with-input-config.type';

export type PropsWithInputChoicesType = {
  choices: ChoiceInterface[];
} & PropsWithInputConfigType;
