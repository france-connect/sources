import { useContext } from 'react';

import './button-logout.scss';
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
      className="ButtonLogoutComponent fs18 p12"
      href={endSessionUrl}
      title="Se déconnecter"
    >
      <span>Se déconnecter</span>
    </a>
  );
};

ButtonLogoutComponent.displayName = 'LogoutButtonComponent';
