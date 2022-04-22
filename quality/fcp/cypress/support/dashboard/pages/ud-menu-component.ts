import { ChainableElement } from '../../common/types';

export default class UdMenuComponent {
  get userLabel(): ChainableElement {
    return cy.get('.UserWidgetComponent span');
  }

  get logoutLink(): ChainableElement {
    return cy.get('a[data-testid="logout-button-component"]');
  }

  get historyLink(): ChainableElement {
    return cy.contains(
      '.DesktopNavigationComponent-nav a',
      'Mon historique de navigation',
    );
  }

  get preferencesLink(): ChainableElement {
    return cy.contains('.DesktopNavigationComponent-nav a', 'Gérer mes accès');
  }
}
