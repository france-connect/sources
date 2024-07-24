import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { AlertTypes, Sizes } from '../../enums';

interface AlertComponentProps extends Required<PropsWithChildren> {
  className?: string;
  dataTestId?: string;
  // @NOTE [DSFR] attribute role="alert"
  // - should be defined if the Component is injected dynamicly into the page
  // - should NOT be defined if the Component is not injected dynamicly into the page
  noRole?: boolean;
  size?: Omit<Sizes, Sizes.LARGE>;
  type?: AlertTypes;
}

export const AlertComponent = React.memo(
  ({
    children,
    className,
    dataTestId = 'AlertComponent',
    noRole = false,
    size = Sizes.MEDIUM,
    type = AlertTypes.INFO,
  }: AlertComponentProps) => (
    <div
      className={classnames(className, `fr-alert fr-alert--${type} fr-alert--${size}`)}
      data-testid={dataTestId}
      role={noRole ? undefined : 'alert'}>
      {children}
    </div>
  ),
);

AlertComponent.displayName = 'AlertComponent';
