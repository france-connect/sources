import { ChainableElement } from '../../common/types';

export default class UdMenuComponent {
  get userLabel(): ChainableElement {
    return cy.get(
      'span[data-testid="layout-header-tools-account-component-desktop"]',
    );
  }

  get logoutLink(): ChainableElement {
    return cy.get('a[data-testid="layout-header-tools-logout-button-desktop"]');
  }

  get historyLink(): ChainableElement {
    return cy.contains(
      'header[role="banner"] nav[role="navigation"] a',
      'Mon historique de navigation',
    );
  }

  get preferencesLink(): ChainableElement {
    return cy.contains(
      'header[role="banner"] nav[role="navigation"] a',
      'Gérer mes accès',
    );
  }
}
