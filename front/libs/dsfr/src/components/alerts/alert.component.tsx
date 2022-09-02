import classnames from 'classnames';
import React from 'react';

import { AlertTypes, Sizes } from '../../enums';

export interface AlertComponentProps {
  children: React.ReactNode;
  className?: string;
  // @NOTE [DSFR] attribute role="alert"
  // - should be defined if the Component is injected dynamicly into the page
  // - should NOT be defined if the Component is not injected dynamicly into the page
  noRole?: boolean;
  size?: Omit<Sizes, 'Large'>;
  type?: AlertTypes;
}

export const AlertComponent: React.FC<AlertComponentProps> = React.memo(
  ({ children, className, noRole, size, type }: AlertComponentProps) => (
    <div
      className={classnames(className, `fr-alert fr-alert--${type} fr-alert--${size}`)}
      data-testid="AlertComponent"
      role={noRole ? undefined : 'alert'}>
      {children}
    </div>
  ),
);

AlertComponent.defaultProps = {
  className: undefined,
  noRole: false,
  size: Sizes.MEDIUM,
  type: AlertTypes.INFO,
};

AlertComponent.displayName = 'AlertComponent';
