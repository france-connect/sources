import { ChainableElement } from '../../common/types';

export default class IdentityProviderSelectionPage {
  getBackToServiceProviderLink(): ChainableElement {
    return cy.get('.previous-link-container');
  }

  getMinistries(): ChainableElement {
    return cy.get(
      '#identity-provider-result dl[data-testid^="ministry-search-list__"] dt',
    );
  }

  getIdentityProviders(): ChainableElement {
    return cy.get('#identity-provider-result button');
  }

  checkIsVisible(): void {
    cy.url().should('include', '/api/v2/interaction');
  }

  searchIdentityProvider(terms: string): void {
    cy.get('#fi-search-term').clear().type(terms);
  }

  getIdpButton(idpId: string): ChainableElement {
    return cy.get(`#idp-${idpId}-button`);
  }

  checkIsMinistryVisible(name: string): void {
    cy.contains(name).should('be.visible');
  }

  checkIsNoResultMessageIsVisible(): void {
    cy.contains('Aucun fournisseur d’identité n’a été trouvé').should(
      'be.visible',
    );
  }
}
