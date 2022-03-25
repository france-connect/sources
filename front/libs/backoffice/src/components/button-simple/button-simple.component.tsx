import './button-simple.scss';

import classnames from 'classnames';
import React, { MouseEventHandler } from 'react';

interface ButtonSimpleComponentProps {
  label: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  secondary?: boolean;
  disabled?: boolean;
}

export const ButtonSimpleComponent: React.FC<ButtonSimpleComponentProps> = React.memo(
  ({ className, disabled, label, onClick, secondary, type }: ButtonSimpleComponentProps) => (
    <button
      className={classnames(
        'ButtonSimpleComponent is-inline-block lh24 py8 px24',
        { disabled, secondary },
        className,
      )}
      data-testid="button-simple-component"
      disabled={disabled}
      type={type}
      onClick={onClick}>
      <span>{label}</span>
    </button>
  ),
);

ButtonSimpleComponent.defaultProps = {
  className: '',
  disabled: false,
  onClick: undefined,
  secondary: false,
  type: 'button',
};

ButtonSimpleComponent.displayName = 'ButtonSimpleComponent';
