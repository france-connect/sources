import './header.scss';

import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { LogoMarianneComponent } from '../assets';

type LayoutHeaderProps = {
  logo: React.ComponentType;
  title: string;
  returnButton?: React.ComponentType;
};

export const LayoutHeaderComponent =
  // @TODO move to fc/front/libs
  ({ logo, returnButton, title }: LayoutHeaderProps): JSX.Element => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    const Logo = logo;
    const ReturnButton = returnButton;
    return (
      <header className="header shadow-bottom" role="banner">
        <div className="is-flex content-wrapper-lg px16 py12" data-testid="banner-content">
          <Link className="flex-columns flex-start items-center" title={title} to="/">
            <LogoMarianneComponent className="mr40" />
            <Logo />
          </Link>
          {ReturnButton && gtTablet && <ReturnButton />}
        </div>
        {ReturnButton && !gtTablet && <ReturnButton />}
      </header>
    );
  };

LayoutHeaderComponent.defaultProps = {
  returnButton: null,
};

LayoutHeaderComponent.displayName = 'LayoutHeaderComponent';
