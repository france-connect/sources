import './layout-header-logos.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { LogoMarianneComponent } from '../../assets';

type LayoutHeaderLogosComponentProps = {
  logo: React.FunctionComponent;
  title: string;
};

export const LayoutHeaderLogosComponent: React.FC<LayoutHeaderLogosComponentProps> = React.memo(
  ({ logo: Logo, title }: LayoutHeaderLogosComponentProps): JSX.Element => (
    <Link
      className="LayoutHeaderComponent-logos flex-columns flex-start items-center"
      title={title}
      to="/">
      <LogoMarianneComponent className="mr40" />
      <Logo />
    </Link>
  ),
);

LayoutHeaderLogosComponent.displayName = 'LayoutHeaderLogosComponent';
