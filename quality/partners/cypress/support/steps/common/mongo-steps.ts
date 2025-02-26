import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(
  'je supprime le fournisseur de service avec le clientId {string} dans MongoDB',
  function (key: string) {
    const args = {
      collection: 'client',
      query: { key },
    };
    cy.task('mongoDeleteOne', args).then((result: object) => {
      cy.log(JSON.stringify(result));
    });
  },
);

Then(
  'je récupère le fournisseur de service {string} dans MongoDB',
  function (name: string) {
    const args = {
      collection: 'client',
      query: { name },
    };
    cy.task('mongoFindOne', args)
      .as('mongoServiceProvider')
      .then((result: object) => {
        cy.log(JSON.stringify(result));
      });
  },
);

Then(
  'je récupère le fournisseur de service avec le clientId {string} dans MongoDB',
  function (key: string) {
    const args = {
      collection: 'client',
      query: { key },
    };
    cy.task('mongoFindOne', args)
      .as('mongoServiceProvider')
      .then((result: object) => {
        cy.log(JSON.stringify(result));
      });
  },
);

Then('le fournisseur de service est au bon format dans MongoDB', function () {
  expect(this.mongoServiceProvider).to.exist;
  expect(this.mongoServiceProvider).to.haveOwnProperty('_id');
  // TODO Validate a DTO to make sure the SP will work with core-fcp-low
});

Then(
  'le nom du fournisseur de service est {string} dans MongoDB',
  function (name: string) {
    expect(this.mongoServiceProvider).to.exist;
    expect(this.mongoServiceProvider.name).to.equal(name);
  },
);
