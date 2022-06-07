import React from 'react';

export const HomePage = React.memo(() => (
  <div className="content-wrapper-lg text-center fr-mt-8w" id="page-container">
    <h1 className="is-blue-france">Bienvenue sur l’espace partenaire AgentConnect</h1>
    <p>Vous pourrez gérez vos fournisseurs de services et plein d’autres choses</p>
    <a className="fr-link" data-testid="login-button" href="/login">
      Je me connecte
    </a>
  </div>
));

HomePage.displayName = 'HomePage';
