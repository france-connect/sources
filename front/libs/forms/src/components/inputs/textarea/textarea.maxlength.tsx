import classnames from 'classnames';
import React from 'react';

import { t } from '@fc/i18n';

import styles from './textarea.module.scss';

interface TextAreaMaxlengthComponentProps {
  count: number;
  treshold?: number | undefined;
  maxLength: number;
}

export const TextAreaMaxlengthComponent = React.memo(
  ({ count, maxLength, treshold = 10 }: TextAreaMaxlengthComponentProps) => {
    const offlimit = count > maxLength;
    const closeOfflimit = count + treshold > maxLength;
    return (
      <p aria-live="polite" className="fr-text--xs fr-mb-0 fr-mt-1w">
        <span
          className={classnames({
            [styles.textareaOfflimit]: offlimit,
            [styles.textareaCloseTolimit]: !offlimit && closeOfflimit,
          })}>
          {count}
        </span>
        {t('Form.textarea.maxlength', { maxLength })}
      </p>
    );
  },
);

TextAreaMaxlengthComponent.displayName = 'TextAreaMaxlengthComponent';
