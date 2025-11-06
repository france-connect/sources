import React from 'react';

import { t } from '@fc/i18n';
import { redirectToUrl } from '@fc/routing';

interface LayoutHeaderLogoutButtonProps {
  endSessionUrl: string;
}

export const LayoutHeaderLogoutButton = React.memo(
  ({ endSessionUrl }: LayoutHeaderLogoutButtonProps) => {
    const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      localStorage.clear();
      redirectToUrl(endSessionUrl);
    };

    const title = t('Layout.logoutButton.title');
    const label = t('Layout.logoutButton.label');
    return (
      <a
        className="fr-btn fr-icon-logout-box-r-line"
        data-testid="layout-header-tools-logout-button"
        href={endSessionUrl}
        title={title}
        onClick={handleLogout}>
        <span>{label}</span>
      </a>
    );
  },
);

LayoutHeaderLogoutButton.displayName = 'LayoutHeaderLogoutButton';
