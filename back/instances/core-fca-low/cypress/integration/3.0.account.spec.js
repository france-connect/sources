import { basicErrorScenario } from './mire.utils';

/**
 * @todo #473 ETQ Exploitant AG, je ne veux pas bloquer un agent sur FCA
 * ce test n'a aucun intérêt sur FCA, on ne bloque aucun agent sur le core
 */
describe.skip('Account', () => {
  // -- replace by either `fip1-high` or `fia1-low`
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;

  it('should trigger error Y180001 (user blocked)', () => {
    basicErrorScenario({
      errorCode: 'E000001',
      idpId,
    });

    cy.hasError('Y180001');
  });
});
