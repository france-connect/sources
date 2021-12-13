import {
  basicSuccessScenario,
  checkInformations,
  checkInStringifiedJson,
  getServiceProvider,
  beforeSuccessScenario,
  afterSuccessScenario,
} from './mire.utils';

const BASIC_SUB =
  '9aeda75d9da1edba7051a7d16e413a72d5206f16cf68c5872dd4894558dde16a';

describe('Revoke token', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;
  const { SP_ROOT_URL } = getServiceProvider(`${Cypress.env('SP_NAME')}1-low`);

  it('should trigger error Y030116 when token is revoked and we call userInfo endpoint', () => {
    const params = {
      acrValues: 'eidas1',
      userName: 'test',
      password: '123',
      idpId,
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idpId);
    afterSuccessScenario(params);

    // Check user information
    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', BASIC_SUB);

    // reload userinfo with valid token
    cy.get('#reload-userinfo').click();
    cy.url().should('include', `${SP_ROOT_URL}/me`);

    // Check user information
    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', BASIC_SUB);

    // revoke token
    cy.get('#revoke-token').click();
    cy.url().should('include', `${SP_ROOT_URL}/revocation`);
    cy.contains('Le token a été révoqué').should('be.visible');

    // reload userinfo with invalid token
    cy.get('#reload-userinfo').click();

    cy.url().should(
      'include',
      `${SP_ROOT_URL}/error?error=invalid_token&error_description=invalid%20token%20provided`,
    );

    cy.contains('Error: invalid_token').should('be.visible');
    cy.contains('invalid token provided').should('be.visible');
  });
});
