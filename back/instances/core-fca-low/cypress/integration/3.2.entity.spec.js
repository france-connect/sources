import { checkInStringifiedJson, basicScenario } from './mire.utils';

describe('Entity', () => {
  const idpId = `${Cypress.env('IDP_NAME')}1-low`;

  it('should have the same client Sub from 2 SP with same entityId', () => {
    basicScenario({
      idpId,
    });

    // return to FS
    cy.url().should('match', /interaction\/[^\/]+\/verify/);

    // Capture Sub from the first SP
    cy.get('#json').then((elem) => {
      const { sub } = JSON.parse(elem.text().trim());
      cy.wrap({ sub }).as('client:sub');
    });

    basicScenario({
      idpId,
      sp: `${Cypress.env('SP_NAME')}1-low`,
    });

    // return to FS
    cy.url().should('match', /interaction\/[^\/]+\/verify/);

    // Compare the two Sub from two linked FS
    cy.get('@client:sub').then(({ sub: previousSub }) => {
      checkInStringifiedJson('sub', previousSub);
    });
  });
});
