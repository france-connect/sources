import React, { useMemo } from 'react';

import { t } from '@fc/i18n';

import { ComponentTypes } from '../../../enums';
import { useFieldMeta } from '../../../hooks';
import type { PropsWithInputChoicesType } from '../../../types';
import { GroupElement, LabelElement, MessageElement } from '../../elements';

export const SelectInput = React.memo(
  ({ choices, config, input, meta }: PropsWithInputChoicesType) => {
    const { hint, label, required } = config;
    const { className, disabled, name } = input;

    const { errorMessage, hasError, isValid } = useFieldMeta(meta);

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
        <LabelElement hint={hint} label={label} name={name} required={required} />
        <select {...input} className="fr-select fr-select--valid">
          <option disabled hidden value="">
            {t('Form.select.placeholder')}
          </option>
          {childs}
        </select>
        <MessageElement error={errorMessage} id={name} isValid={isValid} />
      </GroupElement>
    );
  },
);

SelectInput.displayName = 'SelectInput';
