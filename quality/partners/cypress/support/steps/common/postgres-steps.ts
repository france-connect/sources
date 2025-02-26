import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then(
  'je récupère la version {string} dans Postgres',
  function (versionId: string) {
    const args = {
      versionId,
    };
    cy.task('pgFindVersions', args)
      .as('pgVersions')
      .then((result: object) => {
        cy.log(JSON.stringify(result));
      });
  },
);

Then(
  'la propriété {string} de la version est {string} dans Postgres',
  function (property: string, value: string) {
    expect(this.pgVersions).to.exist;
    expect(this.pgVersions.length).to.greaterThan(0);

    const version = this.pgVersions[0];
    expect(Cypress._.get(version, property)).to.equal(value);
  },
);
