import './index.scss';

import classnames from 'classnames';

import { ReactComponent as ButtonSVG } from './button.svg';

export const ButtonFranceConnectComponent = ({
  className,
  onClick,
  type = 'button',
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={classnames(className, 'button')} type={type} onClick={onClick}>
    <ButtonSVG title="S'identifier avec France Connect" />
  </button>
);

ButtonFranceConnectComponent.displayName = 'ButtonFranceConnectComponent';
