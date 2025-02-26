import type { FieldRenderProps } from 'react-final-form';

import type { InputConfigInterface } from '../interfaces';

export type PropsWithInputConfigType = {
  config: InputConfigInterface;
} & FieldRenderProps<string, HTMLElement, string>;
