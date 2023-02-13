import './button-logout.scss';

import { useContext } from 'react';

import { useApiGet } from '@fc/common';
import { AppContext, AppContextInterface } from '@fc/state-management';

export const ButtonLogoutComponent = () => {
  const {
    state: { config },
  } = useContext<AppContextInterface>(AppContext);

  const endpoint = config.OidcClient.endpoints.getEndSessionUrl;
  const endSessionUrl = useApiGet<string>({ endpoint });

  return (
    <a
      className="button-logout-component fr-text--lg fr-p-3v"
      href={endSessionUrl}
      title="Se déconnecter">
      <span>Se déconnecter</span>
    </a>
  );
};

ButtonLogoutComponent.displayName = 'LogoutButtonComponent';
