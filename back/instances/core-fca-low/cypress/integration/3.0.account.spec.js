import { basicErrorScenario } from './mire.utils';

/**
 * @todo #473 ETQ Exploitant AG, je ne veux pas bloquer un agent sur FCA
 * ce test n'a aucun intérêt sur FCA, on ne bloque aucun agent sur le core
 */
describe.skip('Account', () => {
  const idpId = '9c716f61-b8a1-435c-a407-ef4d677ec270';

  it('should trigger error Y180001 (user blocked)', () => {
    basicErrorScenario({
      errorCode: 'E000001',
      idpId,
    });

    cy.hasError('Y180001');
  });
});
