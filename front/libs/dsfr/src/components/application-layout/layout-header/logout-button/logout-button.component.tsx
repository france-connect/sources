import classnames from 'classnames';
import React, { useContext } from 'react';
import { RiCloseLine as CloseIcon } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import { AppContext, AppContextInterface } from '@fc/state-management';

interface LogoutButtonComponentProps {
  className?: string;
}

export const LogoutButtonComponent: React.FC<LogoutButtonComponentProps> = React.memo(
  ({ className }: LogoutButtonComponentProps) => {
    const gtTablet = useMediaQuery({ query: '(min-width: 768px)' });

    const { state } = useContext<AppContextInterface>(AppContext);
    const { endSessionUrl } = state.config.OidcClient.endpoints;

    return (
      <a
        className={classnames(
          'LogoutButtonComponent flex-columns items-center no-flex-grow no-white-space',
          { 'flex-end': gtTablet },
          className,
        )}
        data-testid="logout-button-component"
        href={endSessionUrl}
        title="bouton permettant la déconnexion de votre compte">
        <CloseIcon className="mr8" />
        <span>Se déconnecter</span>
      </a>
    );
  },
);

LogoutButtonComponent.defaultProps = {
  className: '',
};

LogoutButtonComponent.displayName = 'LogoutButtonComponent';
