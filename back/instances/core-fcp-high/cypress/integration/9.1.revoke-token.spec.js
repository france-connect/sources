import {
  basicSuccessScenario,
  checkInformationsServiceProvider,
  checkInStringifiedJson,
} from './mire.utils';

describe('9.1 - Revoke token', () => {
  it('should trigger error Y030116 when token is revoked and we call userInfo endpoint', () => {
    basicSuccessScenario({
      userName: 'test',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas2',
      idpId: 'fip1-high',
    });

    // Check user information
    checkInformationsServiceProvider({
      gender: 'Femme',
      givenName: 'Angela Claire Louise',
      familyName: 'DUBOIS',
      birthdate: '1962-08-24',
      birthplace: '75107',
      birthcountry: '99100',
    });
    checkInStringifiedJson(
      'sub',
      '4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1',
    );

    // reload userinfo with valid token
    cy.get('#reload-userinfo').click();
    cy.url().should('include', `${Cypress.env('SP1_ROOT_URL')}/me`);

    // Check user information
    checkInformationsServiceProvider({
      gender: 'Femme',
      givenName: 'Angela Claire Louise',
      familyName: 'DUBOIS',
      birthdate: '1962-08-24',
      birthplace: '75107',
      birthcountry: '99100',
    });
    checkInStringifiedJson(
      'sub',
      '4d327dd1e427daf4d50296ab71d6f3fc82ccc40742943521d42cb2bae4df41afv1',
    );

    // revoke token
    cy.get('#revoke-token').click();
    cy.url().should('include', `${Cypress.env('SP1_ROOT_URL')}/revocation`);
    cy.contains('Le token a été révoqué').should('be.visible');

    // reload userinfo with invalid token
    cy.get('#reload-userinfo').click();

    cy.url().should(
      'include',
      `${Cypress.env(
        'SP1_ROOT_URL',
      )}/error?error=invalid_token&error_description=invalid%20token%20provided`,
    );

    cy.contains('Error: invalid_token').should('be.visible');
    cy.contains('invalid token provided').should('be.visible');
  });
});
