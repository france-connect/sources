import React from 'react';
import { Link } from 'react-router-dom';

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
    const Logo = logo;
    const ReturnButton = returnButton;
    return (
      <header className="shadow-bottom mb40" role="banner">
        <div className="is-flex content-wrapper-lg px8 py12">
          <Link
            className="flex-columns flex-start items-center"
            title={title}
            to="/"
          >
            <LogoMarianneComponent className="mr40" />
            <Logo />
          </Link>
          {ReturnButton && <ReturnButton />}
        </div>
      </header>
    );
  },
);

LayoutHeaderComponent.displayName = 'LayoutHeaderComponent';
