import React, { useMemo } from 'react';

import { t } from '@fc/i18n';

import { ComponentTypes } from '../../../enums';
import { useFieldMessages, useFieldMeta } from '../../../hooks';
import type { PropsWithInputChoicesType } from '../../../types';
import { GroupElement, LabelElement, MessagesElement } from '../../elements';

export const SelectInput = React.memo(
  ({ choices, config, input, meta }: PropsWithInputChoicesType) => {
    const { hint, label, messages, required, seeAlso } = config;
    const { className, disabled, name } = input;

    const { errorsList, hasError, isValid } = useFieldMeta(meta);

    const fieldMessages = useFieldMessages({ errorsList, isValid, messages });
    const hasMessages = fieldMessages && fieldMessages.length > 0;

    const childs = useMemo(
      () =>
        choices.map((choice) => (
          <option key={`select::${name}::option::${choice.value}`} value={choice.value}>
            {choice.label}
          </option>
        )),
      [choices, name],
    );

    return (
      <GroupElement
        className={className}
        disabled={disabled}
        hasError={hasError}
        isValid={isValid}
        type={ComponentTypes.SELECT}>
        <LabelElement hint={hint} label={label} name={name} required={required} seeAlso={seeAlso} />
        {/* @NOTE input is coming from react-final-form */}
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <select {...input} className="fr-select fr-select--valid">
          <option disabled hidden value="">
            {t('Form.select.placeholder')}
          </option>
          {childs}
        </select>
        {hasMessages && (
          <MessagesElement dataTestId={`${name}-messages`} id={name} messages={fieldMessages} />
        )}
      </GroupElement>
    );
  },
);

SelectInput.displayName = 'SelectInput';
