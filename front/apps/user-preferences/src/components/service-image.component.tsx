import classnames from 'classnames';
import React from 'react';

import type { PropsWithClassName } from '@fc/common';
import { t } from '@fc/i18n';

import type { ServiceInterface } from '../interfaces';
import styles from './service-image.module.scss';

interface ServiceImageComponentProps extends PropsWithClassName {
  disabled?: boolean;
  className?: string;
  service: ServiceInterface;
}

export const ServiceImageComponent = React.memo(
  ({ className = undefined, disabled = false, service }: ServiceImageComponentProps) => {
    const { image, title } = service;
    const idpLabel = t('UserPreferences.labels.idp');
    return (
      <div
        className={classnames(
          styles.image,
          'is-relative no-overflow fr-mr-3w',
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { disabled, 'is-table': !image, 'opacity-45': disabled },
          className,
        )}>
        {(!image && (
          <b className="is-table-cell v-align-middle text-center w100 fr-text--sm">{title}</b>
        )) || (
          <img
            alt={`${idpLabel} ${title}`}
            className="is-block is-absolute"
            height="auto"
            src={`/images/fi/${image}`}
            width="auto"
          />
        )}
      </div>
    );
  },
);

ServiceImageComponent.displayName = 'ServiceImageComponent';
