import type { FieldRenderProps } from 'react-final-form';

import type { InputConfigInterface } from '../interfaces';

// @NOTE quick fix to avoid type errors
// react-final-form should be replaced by react-hook-form
export type ExtendedFieldRenderProps = Omit<
  FieldRenderProps<string, HTMLElement, string>,
  'input'
> & {
  input: FieldRenderProps<string, HTMLElement, string>['input'] & {
    className?: string;
    disabled?: boolean;
  };
};

export type PropsWithInputConfigType = {
  config: InputConfigInterface;
} & ExtendedFieldRenderProps;
