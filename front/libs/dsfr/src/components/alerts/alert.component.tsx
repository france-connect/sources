import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { EventTypes, type PropsWithClassName } from '@fc/common';

import { Sizes } from '../../enums';

interface AlertComponentProps extends Required<PropsWithChildren>, PropsWithClassName {
  dataTestId?: string;
  // @NOTE [DSFR] attribute role="alert"
  // - should be defined if the Component is injected dynamicly into the page
  // - should NOT be defined if the Component is not injected dynamicly into the page
  noRole?: boolean;
  size?: Omit<Sizes, Sizes.LARGE>;
  type?: EventTypes;
}

/**
 * @deprecated
 * Use `AlertComponentV2` instead
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/2007
 */
export const AlertComponent = React.memo(
  ({
    children,
    className,
    dataTestId = 'AlertComponent',
    noRole = false,
    size = Sizes.MEDIUM,
    type = EventTypes.INFO,
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
