import classnames from 'classnames';
import React from 'react';

import { Service } from '../interfaces';

interface ServiceImageComponentProps {
  disabled?: boolean;
  className?: string;
  service: Service;
}

export const ServiceImageComponent: React.FC<ServiceImageComponentProps> = React.memo(
  ({ className, disabled, service }: ServiceImageComponentProps) => {
    const { image, title } = service;
    return (
      <div
        className={classnames(
          'ServiceComponent-image is-relative no-overflow mr24',
          // class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { disabled, 'is-table': !image, 'opacity-45': disabled },
          className,
        )}>
        {image && (
          <img
            alt={`fournisseur d'identité ${title}`}
            height="auto"
            src={`/images/${image}`}
            width="auto"
          />
        )}
        {!image && <b className="is-table-cell v-align-middle text-center w100 fs14">{title}</b>}
      </div>
    );
  },
);

ServiceImageComponent.defaultProps = {
  className: undefined,
  disabled: false,
};

ServiceImageComponent.displayName = 'ServiceImageComponent';
