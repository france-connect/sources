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

  setMockAcrValue(idpAcr: string): void {
    cy.get('[name="acr"]').then(($elem) => {
      if ($elem.is('select')) {
        cy.wrap($elem).select(idpAcr);
      } else {
        cy.wrap($elem).clear();
        cy.wrap($elem).type(idpAcr);
      }
    });
  }

  login(userCredentials: Partial<UserCredentials>): void {
    const { password = '123', username } = userCredentials;
    cy.get(this.usernameSelector).clearThenType(username);
    cy.get(this.passwordSelector).clearThenType(password, { log: false });
    cy.get(this.loginButtonSelector).click();
  }

  useCustomIdentity(user: User): void {
    cy.get('#custom-identity-link').click();

    const fields = [
      'given_name',
      'family_name',
      'preferred_username',
      'birthdate',
      'birthplace',
      'birthcountry',
      'email',
      'acr',
    ];

    fields.forEach((field) => {
      const value = user.claims[field] as string;
      if (value) {
        cy.get(`input#${field}`).clearThenType(value);
      }
    });

    cy.get('select#gender').select(user.claims.gender);

    cy.get(this.loginButtonSelector).click();
  }

  getBackToFCLink(): ChainableElement {
    return cy.get("[data-testid='back-to-fc-link']");
  }
}
