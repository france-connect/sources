import classnames from 'classnames';
import React from 'react';

import { Sizes } from '@fc/dsfr';

import type { PropsWithInputChoiceType } from '../../../types';
import { LabelElement } from '../../elements';

export const ChoiceInput = React.memo(({ choice, config, input }: PropsWithInputChoiceType) => {
  const { name, type } = input;
  const { disabled, hint, label, value } = choice;
  const { inline, seeAlso, size = Sizes.MEDIUM } = config;

  const id = `${name}-${value}`;
  return (
    <div
      className={classnames('fr-fieldset__element', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-fieldset__element--inline': !!inline,
      })}>
      <div
        className={classnames(`fr-${type}-group`, {
          [`fr-${type}-group--${size}`]: !!size,
        })}>
        <input {...input} data-testid={`${id}--testid`} disabled={disabled} id={id} />
        <LabelElement hint={hint} label={label} name={id} seeAlso={seeAlso} />
      </div>
    </div>
  );
});

ChoiceInput.displayName = 'ChoiceInput';
