import React, { useCallback } from 'react';
import { useFieldArray } from 'react-final-form-arrays';

import { Strings } from '@fc/common';

import type { FieldConfigInterface } from '../../../interfaces';
import { ArrayAddButton, LabelElement } from '../../elements';
import { TextWithRemoveInput } from '../../inputs';

interface ArrayFieldProps {
  config: FieldConfigInterface;
}

export const ArrayField = React.memo(({ config }: ArrayFieldProps) => {
  const { hint, label, messages, name, required, seeAlso, validate } = config;

  const { fields } = useFieldArray(name);

  const pushHandler = useCallback(() => {
    fields.push(Strings.EMPTY_STRING);
  }, [fields]);

  const removeHandler = useCallback(
    (index: number) => {
      fields.remove(index);
    },
    [fields],
  );

  return (
    <div className="fr-input-group">
      <LabelElement
        className="fr-label fr-mb-2v"
        hint={hint}
        label={label}
        name={name}
        required={required}
        seeAlso={seeAlso}
      />
      <div>
        {fields.map((fieldName, index) => {
          const isRemovable = (fields.length && fields.length > 1) || index !== 0;
          return (
            <TextWithRemoveInput
              key={fieldName}
              fieldName={fieldName}
              index={index}
              isRemovable={isRemovable}
              messages={messages}
              validate={validate}
              onRemove={removeHandler}
            />
          );
        })}
      </div>
      <ArrayAddButton dataTestId={`${name}-add`} disabled={false} onClick={pushHandler} />
    </div>
  );
});

ArrayField.displayName = 'ArrayField';
