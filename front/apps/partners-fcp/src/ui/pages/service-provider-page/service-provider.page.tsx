import React from 'react';

import { AccountContext } from '@fc/account';

export const ServiceProviderPage = React.memo(() => (
  <AccountContext.Consumer>
    {({ connected, userinfos }) => (
      <div className="content-wrapper-lg text-center fr-mt-8w" id="page-container">
        <h1 className="is-blue-france">Fournisseurs de service</h1>
        {connected && (
          <p>
            Bienvenue {userinfos?.firstname} {userinfos?.lastname} !
          </p>
        )}

        {!connected && (
          <p>
            Vous devez <a href="/login">vous connecter</a> pour accéder à cette page ultra sécurisée
          </p>
        )}
      </div>
    )}
  </AccountContext.Consumer>
));

ServiceProviderPage.displayName = 'HomePage';
