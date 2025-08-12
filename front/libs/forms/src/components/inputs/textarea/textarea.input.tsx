import React from 'react';

import { ComponentTypes } from '../../../enums';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessagesElement } from '../../elements';
import { TextAreaMaxlengthComponent } from './textarea.maxlength';

export const TextAreaInput = React.memo(({ config, input, meta }: PropsWithInputConfigType) => {
  const { hint, label, maxChars, messages, required, seeAlso } = config;
  const { className, disabled, name } = input;

  const { errorsList, hasError, inputClassname, isValid } = useFieldMeta(meta);

  const fieldMessages = useFieldMessages({ errorsList, isValid, messages });
  const hasMessages = fieldMessages && fieldMessages.length > 0;

  const count = input.value.length;
  const maxLength = maxChars ? Number(maxChars) + 1 : undefined;

  return (
    <GroupElement
      className={className}
      disabled={disabled}
      hasError={hasError}
      isValid={isValid}
      type={ComponentTypes.INPUT}>
      <LabelElement hint={hint} label={label} name={name} required={required} seeAlso={seeAlso} />
      <textarea
        {...input}
        aria-describedby={`${name}-messages`}
        className={inputClassname}
        data-testid={`form-input-textarea-testid-${name}`}
        disabled={disabled}
        maxLength={maxLength}
        name={name}
        rows={4}
      />
      {maxLength && <TextAreaMaxlengthComponent count={count} maxLength={maxLength} />}
      {hasMessages && (
        <MessagesElement dataTestId={`${name}-messages`} id={name} messages={fieldMessages} />
      )}
    </GroupElement>
  );
});

TextAreaInput.displayName = 'TextAreaInput';
