import React from 'react';

import { ComponentTypes, FieldTypes } from '../../../enums';
import { getFieldControlId } from '../../../helpers';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { PropsWithInputConfigType } from '../../../types';
import { GroupElement, LabelElement, MessagesElement } from '../../elements';
import { InputComponent } from '../input';
import { InputWithClipboard } from './with-clipboard';

export const TextInput = React.memo(({ config, input, meta }: PropsWithInputConfigType) => {
  const { hint, label, messages, readonly, required, seeAlso } = config;
  const { className, name, type } = input;

  const { errorsList, hasError, inputClassname, isValid } = useFieldMeta(meta);

  const fieldType = type || FieldTypes.TEXT;
  const fieldMessages = useFieldMessages({ errorsList, isValid, messages });

  const id = getFieldControlId(fieldType, name);
  return (
    <GroupElement
      className={className}
      hasError={hasError}
      isValid={isValid}
      type={ComponentTypes.INPUT}>
      <LabelElement hint={hint} htmlFor={id} label={label} required={required} seeAlso={seeAlso} />
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
      <MessagesElement id={name} messages={fieldMessages} />
    </GroupElement>
  );
});

TextInput.displayName = 'TextInput';
