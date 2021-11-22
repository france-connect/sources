import { IdentityProviderBase, UserCredentials } from '../../common/types';

export default class IdentityProviderPage {
  usernameSelector: string;
  passwordSelector: string;
  loginButtonSelector: string;
  originUrl: string;

  constructor(args: IdentityProviderBase) {
    const {
      selectors: { loginButton, password, username },
      url,
    } = args;
    this.usernameSelector = username;
    this.passwordSelector = password;
    this.loginButtonSelector = loginButton;
    this.originUrl = url;
  }

  checkIsVisible(): void {
    cy.url().should('include', this.originUrl);
  }

  checkIsNotVisible(): void {
    cy.url().should('not.include', this.originUrl);
  }

  setMockAcrValue(acrValue: string): void {
    cy.get('[name="acr"]').select(acrValue);
  }

  login(userCredentials: UserCredentials): void {
    const { password, username } = userCredentials;
    cy.get(this.usernameSelector).clear().type(username);
    cy.get(this.passwordSelector).clear().type(password, { log: false });
    cy.get(this.loginButtonSelector).click();
  }
}
