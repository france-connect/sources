import classnames from 'classnames';
import React, { useCallback } from 'react';
import type { FieldInputProps } from 'react-final-form';

import { type PropsWithClassName, useClipboard } from '@fc/common';

import { ClipboardButton } from '../../../elements';
import { InputComponent } from '../../input';
import classes from './with-clipboard.module.scss';

interface InputWithClipboardProps extends PropsWithClassName {
  id: string;
  input: FieldInputProps<string, HTMLElement>;
  inputClassname?: string | undefined;
}

export const InputWithClipboard = React.memo(
  ({ className, id, input, inputClassname }: InputWithClipboardProps) => {
    const { value } = input;
    const { onCopy } = useClipboard();

    const copyHandler = useCallback(() => {
      onCopy(value);
    }, [value, onCopy]);

    return (
      <div className={classnames('flex-columns', className)}>
        <InputComponent
          readOnly
          className={classnames(inputClassname, classes.withClipboard)}
          id={id}
          input={input}
        />
        <ClipboardButton dataTestId={`${id}-copy-button`} onClick={copyHandler} />
      </div>
    );
  },
);

InputWithClipboard.displayName = 'InputWithClipboard';
