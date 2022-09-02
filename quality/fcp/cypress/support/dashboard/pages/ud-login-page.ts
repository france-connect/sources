import { ChainableElement } from '../../common/types';

export default class UdLoginPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  getExpiredSessionAlert(): ChainableElement {
    return cy.get('[data-testid="AlertComponent"]');
  }

  getAuthorizeButton(): ChainableElement {
    return cy.get('button[type="submit"]');
  }

  checkIsVisible(): void {
    cy.url().should('include', this.udRootUrl);
    cy.contains(
      'h1',
      'Pour accéder à votre historique d’utilisation de FranceConnect, veuillez vous connecter',
    );
    this.getAuthorizeButton().should('be.visible');
  }

  checkIsExpiredSessionAlertDisplayed(displayed: boolean): void {
    if (displayed) {
      cy.contains(
        '[data-testid="AlertComponent"]',
        'Votre session a expiré, veuillez vous reconnecter',
      );
    } else {
      this.getExpiredSessionAlert().should('not.exist');
    }
  }
}
