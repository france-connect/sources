import React from 'react';

interface LayoutHeaderToolsAccountComponentProps {
  lastname: string;
  isMobile: boolean;
  firstname: string;
}

export const LayoutHeaderToolsAccountComponent: React.FC<LayoutHeaderToolsAccountComponentProps> =
  React.memo(({ firstname, isMobile, lastname }: LayoutHeaderToolsAccountComponentProps) => {
    const dataTestId = isMobile
      ? 'layout-header-tools-account-component-mobile'
      : 'layout-header-tools-account-component-desktop';
    return (
      <span className="fr-btn fr-icon-account-line" data-testid={dataTestId}>
        {firstname} {lastname}
      </span>
    );
  });

LayoutHeaderToolsAccountComponent.displayName = 'LayoutHeaderToolsAccountComponent';
