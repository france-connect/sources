import React from 'react';

interface LayoutHeaderToolsLogoutButtonProps {
  endSessionUrl: string;
  isMobile: boolean;
}

export const LayoutHeaderToolsLogoutButton: React.FC<LayoutHeaderToolsLogoutButtonProps> =
  React.memo(({ endSessionUrl, isMobile }: LayoutHeaderToolsLogoutButtonProps) => {
    const dataTestId = isMobile
      ? 'layout-header-tools-logout-button-mobile'
      : 'layout-header-tools-logout-button-desktop';
    return (
      <a
        className="fr-btn fr-fi-logout-box-r-line"
        data-testid={dataTestId}
        href={endSessionUrl}
        title="bouton permettant la déconnexion de votre compte">
        <span>Se déconnecter</span>
      </a>
    );
  });

LayoutHeaderToolsLogoutButton.displayName = 'LayoutHeaderToolsLogoutButton';
