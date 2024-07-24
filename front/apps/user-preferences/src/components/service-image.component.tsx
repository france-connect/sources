import classnames from 'classnames';
import React from 'react';

import type { Service } from '../interfaces';
import styles from './service-image.module.scss';

interface ServiceImageComponentProps {
  disabled?: boolean;
  className?: string;
  service: Service;
}

export const ServiceImageComponent = React.memo(
  ({ className = undefined, disabled = false, service }: ServiceImageComponentProps) => {
    const { image, title } = service;
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
            alt={`fournisseur d'identité ${title}`}
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
