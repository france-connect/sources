import React from 'react';

import { ComponentTypes } from '../../../enums';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessagesElement } from '../../elements';
import { InputComponent } from '../input';
import { InputWithClipboard } from './with-clipboard';

export const TextInput = React.memo(({ config, input, meta }: PropsWithInputConfigType) => {
  const { hint, label, messages, readonly, required, seeAlso } = config;
  const { className, name } = input;

  const { errorsList, hasError, inputClassname, isValid } = useFieldMeta(meta);

  const fieldMessages = useFieldMessages({ errorsList, isValid, messages });
  const hasMessages = fieldMessages && fieldMessages.length > 0;

  const id = `form-input-text-${name}`;
  return (
    <GroupElement
      className={className}
      hasError={hasError}
      isValid={isValid}
      type={ComponentTypes.INPUT}>
      <LabelElement hint={hint} label={label} name={name} required={required} seeAlso={seeAlso} />
      {readonly ? (
        <InputWithClipboard
          className="fr-mt-1w"
          id={id}
          input={input}
          inputClassname={inputClassname}
        />
      ) : (
        <InputComponent className={inputClassname} id={id} input={input} />
      )}
      {hasMessages && (
        <MessagesElement dataTestId={`${name}-messages`} id={name} messages={fieldMessages} />
      )}
    </GroupElement>
  );
});

TextInput.displayName = 'TextInput';
