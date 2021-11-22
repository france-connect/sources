import { beforeSuccessScenario, chooseIdpOnCore } from './mire.utils';

describe('Identity Provider', () => {
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;

  it('should transmit the client_id of the SP that want to use AgentConnect', () => {
    const params = {
      eidasLevel: 1,
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
});
