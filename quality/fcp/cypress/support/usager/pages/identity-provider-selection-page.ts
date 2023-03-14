import { ChainableElement, IdentityProvider } from '../../common/types';

export default class IdentityProviderSelectionPage {
  getBackToServiceProviderLink(): ChainableElement {
    return cy.get('[data-testid="back-to-sp-link"]');
  }

  getIdpGrid(): ChainableElement {
    return cy.get('[data-testid="main-providers"]');
  }

  getIdpButton(idp: IdentityProvider): ChainableElement {
    return cy.get(idp.selectors.idpButton);
  }

  checkIsVisible(): void {
    this.getIdpGrid().should('be.visible');
  }
}
