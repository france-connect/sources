import classnames from 'classnames';
import React from 'react';
import { Field, useField } from 'react-final-form';

import { composeValidators, type ValidatorType } from '@fc/user-dashboard';

export interface TextInput {
  label: string;
  name: string;
  info?: string;
  type?: string;
  validators: ValidatorType[];
  required?: boolean;
  description: string;
}

export const TextInputComponent = React.memo((props: TextInput) => {
  const { description, info = '', label, name, required = true, type = 'text', validators } = props;

  const validate = composeValidators(...validators);

  const metaField = useField(name, {
    subscription: { error: true, touched: true },
  });

  const error = metaField.meta.touched && metaField.meta.error;

  return (
    <div
      className={classnames('fr-input-group', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-input-group--error': !!error,
      })}>
      <label className="fr-label fr-mb-0" htmlFor={name}>
        <b>
          <span className="fr-h7">{required ? `${label}*` : label}</span>
        </b>
        <span className="fr-hint-text">{description}</span>
      </label>

      <Field
        aria-describedby={`${name}-messages`}
        className={classnames('fr-input', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-input--error': !!error,
        })}
        component="input"
        id={name}
        name={name}
        type={type}
        validate={validate}
      />
      <div aria-live="assertive" className="fr-messages-group" id={`${name}-messages`}>
        {!!error && (
          <p className="fr-message fr-message--error" id={`${name}-error-desc`}>
            {error}
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

TextInputComponent.displayName = 'TextInputComponent';
