import classnames from 'classnames';
import React from 'react';
import { Field, useField } from 'react-final-form';

import { Strings } from '@fc/common';

export interface TextAreaInput {
  label: string;
  name: string;
  info?: string;
  description?: string;
  maxLength?: number;
  rows?: number;
}

export const TextAreaInputComponent = React.memo((props: TextAreaInput) => {
  const { description, info = Strings.EMPTY_STRING, label, maxLength, name, rows = 4 } = props;

  const metaField = useField(name, {
    subscription: { value: true },
  });

  const count = metaField.input.value.length;

  return (
    <div className={classnames('fr-input-group')}>
      <label className="fr-label fr-mb-0" htmlFor={name}>
        <b>
          <span className="fr-h7">{label}</span>
        </b>
        {description && <span className="fr-hint-text">{description}</span>}
      </label>

      <Field
        aria-multiline
        aria-describedby={`${name}-messages`}
        className={classnames('fr-input')}
        component="textarea"
        id={name}
        maxLength={maxLength}
        name={name}
        rows={rows}
      />
      <div aria-live="assertive" className="fr-messages-group" id={`${name}-messages`}>
        {maxLength && (
          <p aria-live="polite" className="fr-text--xs fr-mt-1w">
            {count}&nbsp;/&nbsp;{maxLength}&nbsp;caractères
          </p>
        )}
        {!!info && (
          <p className="fr-message fr-message--info" id={`${name}-info-desc`}>
            {info}
          </p>
        )}
      </div>
    </div>
  );
});

TextAreaInputComponent.displayName = 'TextAreaInputComponent';
