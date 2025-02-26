import React from 'react';

import { ComponentTypes } from '../../../enums';
import { useFieldMeta } from '../../../hooks';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessageElement } from '../../elements';
import { TextAreaMaxlengthComponent } from './textarea.maxlength';

export const TextAreaInput = React.memo(({ config, input, meta }: PropsWithInputConfigType) => {
  const { hint, label, maxChars } = config;
  const { className, disabled, name, required } = input;

  const { errorMessage, hasError, inputClassname, isValid } = useFieldMeta(meta);

  const count = input.value.length;
  const maxLength = maxChars ? Number(maxChars) + 1 : undefined;

  return (
    <GroupElement
      className={className}
      disabled={disabled}
      hasError={hasError}
      isValid={isValid}
      type={ComponentTypes.INPUT}>
      <LabelElement hint={hint} label={label} name={name} required={required} />
      <textarea
        {...input}
        aria-describedby={`${name}-messages`}
        className={inputClassname}
        data-testid={`form-input-textarea-testid-${name}`}
        disabled={disabled}
        maxLength={maxLength}
        name={name}
      />
      <MessageElement
        dataTestId={`${name}-messages`}
        error={errorMessage}
        id={name}
        isValid={isValid}
      />
      {maxLength && <TextAreaMaxlengthComponent count={count} maxLength={maxLength} />}
    </GroupElement>
  );
});

TextAreaInput.displayName = 'TextAreaInput';
