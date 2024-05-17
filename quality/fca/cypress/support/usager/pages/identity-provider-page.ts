import { User } from '../../common/helpers';
import {
  ChainableElement,
  IdentityProviderBase,
  UserCredentials,
} from '../../common/types';

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
    cy.get('[name="acr"]').clearThenType(acrValue);
  }

  login(userCredentials: UserCredentials): void {
    const { password, username } = userCredentials;
    cy.get(this.usernameSelector).clearThenType(username);
    cy.get(this.passwordSelector).clearThenType(password, { log: false });
    cy.get(this.loginButtonSelector).click();
  }

  loginWithUsername(username: string): void {
    cy.get(this.usernameSelector).clearThenType(username);
    cy.get(this.loginButtonSelector).click();
  }

  getLogin(): ChainableElement {
    return cy.get('#login');
  }

  useCustomIdentity(user: User): void {
    cy.get('#custom-identity-link').click();

    const fields = [
      'given_name',
      'usual_name',
      'email',
      'uid',
      'siren',
      'siret',
      'organizational_unit',
      'belonging_population',
      'phone_number',
      'chorusdt',
      'acr',
    ];

    fields.forEach((field) => {
      const value = user.claims[field] as string;
      if (value) {
        cy.get(`input#${field}`).clearThenType(value);
      }
    });

    cy.get(this.loginButtonSelector).click();
  }
}
