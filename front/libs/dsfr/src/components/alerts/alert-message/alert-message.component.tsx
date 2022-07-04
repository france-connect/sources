import React from 'react';

import { AlertTypes, Sizes } from '../../../enums';
import { Alert } from '../alert.component';

export interface AlertMessageComponentProps {
  closable?: boolean;
  description?: string;
  size: Sizes;
  title: string;
  type: AlertTypes;
}

export const AlertMessageComponent: React.FC<AlertMessageComponentProps> = React.memo(
  ({ closable, description, size, title, type }: AlertMessageComponentProps) => (
    <Alert size={size} type={type}>
      {size === Sizes.SMALL && <p data-testid="AlertMessageComponent-title-label">{title}</p>}
      {size !== Sizes.SMALL && (
        <p className="fr-alert__title" data-testid="AlertMessageComponent-title-label">
          {title}
        </p>
      )}
      {size !== Sizes.SMALL && description && (
        <p data-testid="AlertMessageComponent-description-label">{description}</p>
      )}
      {closable && (
        <button className="fr-btn--close fr-btn" data-testid="AlertMessageComponent-close-button">
          Masquer le message
        </button>
      )}
    </Alert>
  ),
);

AlertMessageComponent.defaultProps = {
  closable: false,
  description: undefined,
};

AlertMessageComponent.displayName = 'AlertMessageComponent';
