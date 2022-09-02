import { ChainableElement } from '../../common/types';

export default class UdMenuComponent {
  getUserLabel(): ChainableElement {
    return cy.get(
      'span[data-testid="layout-header-tools-account-component-desktop"]',
    );
  }

  getLogoutLink(): ChainableElement {
    return cy.get('a[data-testid="layout-header-tools-logout-button-desktop"]');
  }

  getHistoryLink(): ChainableElement {
    return cy.contains(
      'header[role="banner"] nav[role="navigation"] a',
      'Mon historique de navigation',
    );
  }

  getPreferencesLink(): ChainableElement {
    return cy.contains(
      'header[role="banner"] nav[role="navigation"] a',
      'Gérer mes accès',
    );
  }
}
