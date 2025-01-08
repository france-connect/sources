import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

import type { ComponentTypes } from '../../../enums';

interface GroupElementProps extends Required<PropsWithChildren> {
  hasError?: boolean | undefined;
  isValid?: boolean | undefined;
  className?: string | undefined;
  disabled?: boolean;
  type: ComponentTypes;
}

export const GroupElement = React.memo(
  ({
    children,
    className = undefined,
    disabled = false,
    hasError = undefined,
    isValid = undefined,
    type,
  }: GroupElementProps) => (
    <div
      className={classnames(`fr-${type}-group`, className, {
        [`fr-${type}-group--disabled`]: disabled,
        [`fr-${type}-group--error`]: hasError,
        [`fr-${type}-group--valid`]: isValid,
      })}>
      {children}
    </div>
  ),
);

GroupElement.displayName = 'GroupElement';
