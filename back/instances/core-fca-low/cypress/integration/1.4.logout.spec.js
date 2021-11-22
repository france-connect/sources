import {
  beforeSuccessScenario,
  basicSuccessScenario,
  afterSuccessScenario,
  checkInformations,
  checkInStringifiedJson,
  getServiceProvider,
  logout,
} from './mire.utils';

describe('RP Initiated logout scenarios', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;

  it('should log out from AgentConnect with post logout redirect uri', () => {
    const SUB =
      '9aeda75d9da1edba7051a7d16e413a72d5206f16cf68c5872dd4894558dde16a';

    const params = {
      userName: 'test',
      password: '123',
      idpId,
    };

    beforeSuccessScenario(params);
    basicSuccessScenario(idpId);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB);

    logout();

    const { SP_ROOT_URL } = getServiceProvider('fsa1-low');
    cy.url().should('include', `${SP_ROOT_URL}/`);
  });

  it('should log out from AgentConnect without post logout redirect uri', () => {
    const SUB =
      '85cd916363d19e8b77ea6e7caf7977381b8c5db6505195a5efd02d57e6087f3b';

    const params = {
      userName: 'test',
      password: '123',
      sp: 'fsa2-low',
      idpId,
    };

    beforeSuccessScenario(params);
    basicSuccessScenario(idpId);
    afterSuccessScenario(params);

    checkInformations({
      givenName: 'Angela Claire Louise',
      usualName: 'DUBOIS',
    });
    checkInStringifiedJson('sub', SUB);

    logout();

    cy.url().should(
      'include',
      `${Cypress.env('FC_ROOT_URL')}/api/v2/session/end/success`,
    );
    cy.contains(
      'Vous êtes bien déconnecté, vous pouvez fermer votre navigateur.',
    );
  });
});
