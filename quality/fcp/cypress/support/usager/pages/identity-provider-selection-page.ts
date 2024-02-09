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

  getAidantsConnectLink(): ChainableElement {
    return cy.get('[data-testid="footer-aidants-connect-link"]');
  }

  checkIsVisible(): void {
    this.getIdpGrid().should('be.visible');
  }

  modifyProviderUidOfIdpButton(
    idp: IdentityProvider,
    providerUid: string,
  ): void {
    this.getIdpButton(idp)
      .parent()
      .find('input[name="providerUid"]')
      .invoke('attr', 'value', providerUid);
  }

  modifyCsrfOfIdpButton(idp: IdentityProvider, csrf: string): void {
    this.getIdpButton(idp)
      .parent()
      .find('input[name="csrfToken"]')
      .invoke('attr', 'value', csrf);
  }
}
