import classnames from 'classnames';
import type { PropsWithChildren } from 'react';
import React from 'react';

interface FieldsetElementProps extends Required<PropsWithChildren> {
  className?: string | undefined;
  hasError?: boolean;
  isValid?: boolean;
  name: string;
}

export const FieldsetElement = React.memo(
  ({
    children,
    className = undefined,
    hasError = false,
    isValid = false,
    name,
  }: FieldsetElementProps) => (
    <fieldset
      aria-labelledby={`${name}-legend ${name}-messages`}
      className={classnames('fr-fieldset', className, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-fieldset--error': hasError,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'fr-fieldset--valid': isValid,
      })}
      id={name}
      role="group">
      {children}
    </fieldset>
  ),
);

FieldsetElement.displayName = 'FieldsetElement';
