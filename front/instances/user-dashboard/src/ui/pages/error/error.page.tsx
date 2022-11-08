import classnames from 'classnames';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';
import { Link, Outlet } from 'react-router-dom';

export const ErrorPage = React.memo(() => {
  const gtTablet = useMediaQuery({ query: '(min-width: 992px)' });

  return (
    <React.Fragment>
      <Helmet>
        <title>Mon tableau de bord - Erreur</title>
      </Helmet>
      <div
        className={classnames('large-container fr-m-auto fr-px-2w', {
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-5w': !gtTablet,
          // Class CSS
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'fr-mt-8w': gtTablet,
        })}
        id="page-container">
        <Outlet />
        <p>
          <Link className="fr-btn fr-btn--secondary" to="/">
            Revenir à l&rsquo;accueil
          </Link>
        </p>
      </div>
    </React.Fragment>
  );
});

ErrorPage.displayName = 'ErrorPage';
