import type { FieldRenderProps } from 'react-final-form';

import type { InputConfigInterface } from '../interfaces';

export type PropsWithInputConfigType<
  FieldValue = string,
  T extends HTMLElement = HTMLElement,
  InputValue = FieldValue,
> = {
  config: InputConfigInterface;
} & FieldRenderProps<string, T, InputValue>;
