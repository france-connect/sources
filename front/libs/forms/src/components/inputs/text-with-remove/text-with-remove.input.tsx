import type { FieldValidator } from 'final-form';
import React, { useCallback } from 'react';
import { useField } from 'react-final-form';

import { ComponentTypes } from '../../../enums';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { FieldMessage } from '../../../interfaces';
import { ArrayRemoveButton, GroupElement, MessagesElement } from '../../elements';
import { InputComponent } from '../input';

interface TextWithRemoveInputProps {
  index: number;
  fieldName: string;
  isRemovable?: boolean;
  messages?: FieldMessage[];
  onRemove: (index: number) => void;
  validate: FieldValidator<string> | undefined;
}

export const TextWithRemoveInput = React.memo(
  ({
    fieldName,
    index,
    isRemovable = false,
    messages,
    onRemove,
    validate,
  }: TextWithRemoveInputProps) => {
    const { input, meta } = useField(fieldName, { validate });
    const { errorsList, hasError, inputClassname, isValid } = useFieldMeta(meta);

    const fieldMessages = useFieldMessages({ errorsList, isValid, messages });
    const hasMessages = fieldMessages && fieldMessages.length > 0;

    const removeHandler = useCallback(() => {
      onRemove(index);
    }, [index, onRemove]);

    const { className, disabled, name } = input;
    const id = `form-input-array-${name}`;
    return (
      <GroupElement
        className={className}
        disabled={disabled}
        hasError={hasError}
        isValid={isValid}
        type={ComponentTypes.INPUT}>
        <div className="flex-columns">
          <InputComponent className={inputClassname} disabled={false} id={id} input={input} />
          <ArrayRemoveButton
            dataTestId={`${fieldName}-remove`}
            disabled={!isRemovable}
            onClick={removeHandler}
          />
        </div>
        {hasMessages && (
          <MessagesElement dataTestId={`${name}-messages`} id={id} messages={fieldMessages} />
        )}
      </GroupElement>
    );
  },
);

TextWithRemoveInput.displayName = 'TextWithRemoveInput';
