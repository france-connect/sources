import classnames from 'classnames';
import React from 'react';

import { AlertTypes, Sizes } from '../../enums';

export interface AlertProps {
  children: React.ReactNode;
  type: AlertTypes;
  size: Sizes;
}

export const Alert: React.FC<AlertProps> = React.memo(({ children, size, type }: AlertProps) => (
  <div
    className={classnames(`fr-alert`, {
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fr-alert--error': type === AlertTypes.ERROR,
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fr-alert--info': type === AlertTypes.INFO,
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fr-alert--sm': size === Sizes.SMALL,
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fr-alert--success': type === AlertTypes.SUCCESS,
      // DSFR classname
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'fr-alert--warning': type === AlertTypes.WARNING,
    })}
    data-testid="AlertComponent">
    {children}
  </div>
));

Alert.displayName = 'Alert';
