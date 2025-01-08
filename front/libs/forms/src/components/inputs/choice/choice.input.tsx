import classnames from 'classnames';
import React from 'react';

import { Sizes } from '@fc/dsfr';

import type { PropsWithInputChoiceType } from '../../../types/props-with-input-choice.type';
import { LabelElement } from '../../elements';

export const ChoiceInput = React.memo(
  ({ choice, config, input, type }: PropsWithInputChoiceType) => {
    const { name } = input;
    const { hint, label, value } = choice;
    const { inline = true, size = Sizes.MEDIUM } = config;

    const id = `form-input-${type}-${name}-${value}`;
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
          <input {...input} data-testid={`${id}--testid`} id={id} />
          <LabelElement hint={hint} label={label} name={id} />
        </div>
      </div>
    );
  },
);

ChoiceInput.displayName = 'ChoiceInput';
