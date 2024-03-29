import { beforeSuccessScenario, chooseIdpOnCore } from './mire.utils';

describe('1.1 sp_id parameter', () => {
  const idpId = '9c716f61-b8a1-435c-a407-ef4d677ec270';

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
});
