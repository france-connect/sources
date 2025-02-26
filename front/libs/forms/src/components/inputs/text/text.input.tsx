import React from 'react';

import { ComponentTypes } from '../../../enums';
import { useFieldMeta } from '../../../hooks';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessageElement } from '../../elements';
import { InputComponent } from '../input';
import { InputWithClipboard } from './with-clipboard';

export const TextInput = React.memo(({ config, input, meta }: PropsWithInputConfigType) => {
  const { hint, label, readonly, required } = config;
  const { className, name } = input;

  const { errorMessage, hasError, inputClassname, isValid } = useFieldMeta(meta);

  const id = `form-input-text-${name}`;
  return (
    <GroupElement
      className={className}
      hasError={hasError}
      isValid={isValid}
      type={ComponentTypes.INPUT}>
      <LabelElement hint={hint} label={label} name={name} required={required} />
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
      <MessageElement
        dataTestId={`${name}-messages`}
        error={errorMessage}
        id={name}
        isValid={isValid}
      />
    </GroupElement>
  );
});

TextInput.displayName = 'TextInput';
