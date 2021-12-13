import './header.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { LogoMarianneComponent } from '../logo-marianne';

type LayoutHeaderProps = {
  // @TODO move to fc/front/libs
  logo: React.FunctionComponent;
  title: string;
  returnButton?: React.FunctionComponent;
};

export const LayoutHeaderComponent = React.memo(
  // @TODO move to fc/front/libs
  ({ logo, title, returnButton }: LayoutHeaderProps): JSX.Element => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    const Logo = logo;
    const ReturnButton = returnButton;
    return (
      <header className="header shadow-bottom" role="banner">
        <div className="is-flex content-wrapper-lg px16 py12">
          <Link
            className="flex-columns flex-start items-center"
            title={title}
            to="/"
          >
            <LogoMarianneComponent className="mr40" />
            <Logo />
          </Link>
          {ReturnButton && gtTablet && <ReturnButton />}
        </div>
        {ReturnButton && !gtTablet && <ReturnButton />}
      </header>
    );
  },
);

LayoutHeaderComponent.displayName = 'LayoutHeaderComponent';
