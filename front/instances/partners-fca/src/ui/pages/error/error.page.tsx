import React from 'react';
import { Helmet } from 'react-helmet';

export const ErrorPage = React.memo(() => (
  <React.Fragment>
    <Helmet>
      <title>Partenaires AgentConnect - Erreur</title>
    </Helmet>
    <div className="fr-container text-center fr-mt-8w">
      <h1 className="text-center">Une erreur est survenue</h1>
      <h2 className="text-center">
        <span>Erreur</span>
      </h2>
      <p className="text-center">Ceci est une erreur</p>
    </div>
  </React.Fragment>
));

ErrorPage.displayName = 'ErrorPage';
