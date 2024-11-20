import { ChainableElement } from '../../common/types';

export default class UdMenuComponent {
  getUserLabel(): ChainableElement {
    return cy.get(
      '.fr-header__tools span[data-testid="layout-header-tools-account-component"]',
    );
  }

  getLogoutLink(): ChainableElement {
    return cy.get(
      '.fr-header__tools a[data-testid="layout-header-tools-logout-button"]',
    );
  }

  getHistoryLink(): ChainableElement {
    return cy.contains(
      'header[role="banner"] nav[role="navigation"] a',
      'Consulter mon historique',
    );
  }

  getPreferencesLink(): ChainableElement {
    return cy.contains(
      'header[role="banner"] nav[role="navigation"] a',
      'Gérer mes accès',
    );
  }

  getOpenMobileMenuButton(): ChainableElement {
    return cy.get('#burger-button-mobile-menu');
  }

  getPreferencesMobileLink(): ChainableElement {
    return cy.contains(
      '#layout-header-menu-modal nav[role="navigation"] a',
      'Gérer mes accès',
    );
  }
}
