import {
  afterSuccessScenario,
  basicSuccessScenario,
  beforeSuccessScenario,
  checkInformations,
  getServiceProvider,
  logout,
} from './mire.utils';

describe('RP Initiated logout scenarios', () => {
  const idpId = '9c716f61-b8a1-435c-a407-ef4d677ec270';

  it('should log out from AgentConnect with post logout redirect uri', () => {
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

    logout();

    const { SP_ROOT_URL } = getServiceProvider('fsa1-low');
    cy.url().should('include', `${SP_ROOT_URL}/`);
  });

  it('should log out from AgentConnect without post logout redirect uri', () => {
    const SUB =
      '3ff73e7fa55d48533a434b52b8ffc8c223660775c1fad17022ae8feedcc63ce4';

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
