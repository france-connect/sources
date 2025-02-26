import type { FieldValidator } from 'final-form';
import React, { useCallback } from 'react';
import { useField } from 'react-final-form';

import { ComponentTypes } from '../../../enums';
import { useFieldMeta } from '../../../hooks';
import { ArrayRemoveButton, GroupElement, MessageElement } from '../../elements';
import { InputComponent } from '../input';

interface TextWithRemoveInputProps {
  index: number;
  fieldName: string;
  isRemovable?: boolean;
  onRemove: (index: number) => void;
  validate: FieldValidator<string> | undefined;
}

export const TextWithRemoveInput = React.memo(
  ({ fieldName, index, isRemovable = false, onRemove, validate }: TextWithRemoveInputProps) => {
    const { input, meta } = useField(fieldName, { validate });
    const { errorMessage, hasError, inputClassname, isValid } = useFieldMeta(meta);

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
        <MessageElement
          dataTestId={`${name}-messages`}
          error={errorMessage}
          id={id}
          isValid={isValid}
        />
      </GroupElement>
    );
  },
);

TextWithRemoveInput.displayName = 'TextWithRemoveInput';
