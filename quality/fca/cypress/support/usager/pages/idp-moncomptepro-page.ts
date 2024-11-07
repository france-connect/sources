import { UserCredentials } from '../../common/types';

export default class IdpMonCompteProPage {
  loginWithSavedUsername({ password }: UserCredentials): void {
    cy.get(".fr-password input[name='password']").clearThenType(password, {
      log: false,
    });
    cy.get("button[type='submit']").first().click();
  }

  selectPublicOrganization(): void {
    cy.get('#submit-join-organization-1').click();
  }

  selectPrivateOrganization(): void {
    cy.get('#submit-join-organization-49').click();
  }
}
