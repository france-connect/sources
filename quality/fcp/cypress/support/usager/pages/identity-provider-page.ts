import { User } from '../../common/helpers';
import {
  ChainableElement,
  IdentityProviderBase,
  ScopeContext,
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

  checkMockAcrValue(idpAcr: string): void {
    cy.get('[name="acr"]').should('have.value', idpAcr);
  }

  setMockAcrValue(idpAcr: string): void {
    cy.get('[name="acr"]').then(($elem) => {
      if ($elem.is('select')) {
        cy.wrap($elem).select(idpAcr);
      } else {
        cy.wrap($elem).clearThenType(idpAcr);
      }
    });
  }

  login(userCredentials: Partial<UserCredentials>): void {
    const { password = '123', username } = userCredentials;
    cy.get(this.usernameSelector).clearThenType(username);
    cy.get(this.passwordSelector).clearThenType(password, { log: false });
    cy.get(this.loginButtonSelector).click();
  }

  setRepScope({ scopes }: ScopeContext): void {
    if (scopes.length > 0) {
      const value = scopes.join(' ');
      cy.get('input#rep_scope').clearThenType(value);
    }
  }

  useCustomIdentity(user: User, repScopeContext?: ScopeContext): void {
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

    if (repScopeContext) {
      this.setRepScope(repScopeContext);
    }

    cy.get(this.loginButtonSelector).click();
  }

  getBackToFCLink(): ChainableElement {
    return cy.get("[data-testid='back-to-fc-link']");
  }
}
