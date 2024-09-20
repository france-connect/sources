import React from 'react';

interface LayoutHeaderLogoutButtonProps {
  endSessionUrl: string;
}

export const LayoutHeaderLogoutButton = React.memo(
  ({ endSessionUrl }: LayoutHeaderLogoutButtonProps) => (
    <a
      className="fr-btn fr-icon-logout-box-r-line"
      data-testid="layout-header-tools-logout-button"
      href={endSessionUrl}
      title="bouton permettant la déconnexion de votre compte">
      <span>Se déconnecter</span>
    </a>
  ),
);

LayoutHeaderLogoutButton.displayName = 'LayoutHeaderLogoutButton';
