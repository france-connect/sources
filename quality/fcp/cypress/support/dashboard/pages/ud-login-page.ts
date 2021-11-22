import { ChainableElement, UserCredentials } from '../../common/types';

export default class UdLoginPage {
  udRootUrl: string;

  constructor(udRootUrl: string) {
    this.udRootUrl = udRootUrl;
  }

  get authorizeButton(): ChainableElement {
    return cy.get('button[type="submit"]');
  }

  get idpButton(): ChainableElement {
    // TODO: make this based on current IDP fixture
    return cy.get('#fi-fip1');
  }

  get usernameInput(): ChainableElement {
    return cy.get('input[name="login"]');
  }

  get passwordInput(): ChainableElement {
    return cy.get('input[name="password"]');
  }

  get loginButton(): ChainableElement {
    return cy.get('input[type="submit"]');
  }

  get consentButton(): ChainableElement {
    return cy.get('button.content__continue');
  }

  checkIsVisible(): void {
    cy.url().should('includes', this.udRootUrl);
  }

  login(user: UserCredentials): void {
    this.authorizeButton.click();
    this.idpButton.click();
    this.usernameInput.clear().type(user.username);
    this.passwordInput.clear().type(user.password, { log: false });
    this.loginButton.click();
    this.consentButton.click();
  }
}
