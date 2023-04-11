import {
  basicScenario,
  basicSuccessScenario,
  beforeSuccessScenario,
  checkInStringifiedJson,
} from './mire.utils';

/**
 * The entityId test can not be done with AgentConnect,
 * The sub is not link to entityId
 */
describe.skip('Entity', () => {
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;

  it('should have the same client Sub from 2 SP with same entityId', () => {
    basicScenario({
      idpId,
      sp: `${Cypress.env('SP_NAME')}1-low`,
    });

    // return to FS
    cy.url().should('match', /interaction\/verify/);

    // Capture Sub from the first SP
    cy.get('#json').then((elem) => {
      const { sub } = JSON.parse(elem.text().trim());
      cy.wrap({ sub }).as('client:sub');
    });

    const params = {
      sp: `${Cypress.env('SP_NAME')}2-low`,
      idpId,
    };

    beforeSuccessScenario(params);
    basicSuccessScenario(params.idpId);
    // SSO activated

    // return to FS
    cy.url().should('match', /interaction\/verify/);

    // Compare the two Sub from two linked FS
    cy.get('@client:sub').then(({ sub: previousSub }) => {
      checkInStringifiedJson('sub', previousSub);
    });
  });
});
