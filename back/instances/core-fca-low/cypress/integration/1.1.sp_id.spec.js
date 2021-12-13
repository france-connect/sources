import {
  afterSuccessScenario,
  basicSuccessScenario,
  beforeSuccessScenario,
  chooseIdpOnCore,
} from './mire.utils';

describe('1.1 sp_id parameter', () => {
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;
  const spId =
    '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950';

  it('should transmit the client_id of the SP that want to use AgentConnect', () => {
    const params = {
      acrValues: 'eidas1',
      idpId,
    };
    const finalSpId =
      '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950';

    beforeSuccessScenario(params);
    chooseIdpOnCore(idpId);

    cy.get('#final-sp-id').contains(
      `Identifiant du client final: ${finalSpId}`,
    );
  });

  it('should send the same sp_id parameter on /authorize and /token', () => {
    cy.clearLog(idpId);

    const params = {
      acrValues: 'eidas1',
      idpId,
      password: '123',
      userName: 'test',
    };
    beforeSuccessScenario(params);
    basicSuccessScenario(idpId);
    afterSuccessScenario(params);

    cy.log('Search for sp_id in /authorize');
    const authorizeLog = JSON.stringify(['/authorize', 'sp_id', spId]);
    cy.hasLog(idpId, authorizeLog);

    cy.log('Search for sp_id in /token');
    const tokenLog = JSON.stringify(['/token', 'sp_id', spId]);
    cy.hasLog(idpId, tokenLog);
  });
});
