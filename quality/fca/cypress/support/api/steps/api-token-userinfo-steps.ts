import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('le corps de la réponse contient le JWT id_token pour le FS', function () {
  cy.get('@apiResponse')
    .its('body.id_token')
    .then((idToken) => {
      expect(idToken).to.be.a('string');
      expect(idToken.length).to.be.greaterThan(500);
      const jwk = Cypress.env('RSA_ENC_PRIV_KEY');
      cy.task('getJwtContent', { jwk, jwt: idToken }).then((jwtContent) => {
        const content = JSON.stringify(jwtContent, null, 2);
        cy.document().then((document) => {
          document.documentElement.innerHTML = content;
        });
        cy.get('body')
          .invoke('text')
          .then((json) => JSON.parse(json))
          .as('jwt');
      });
    });
});

Then('le corps de la réponse contient le JWT userinfo pour le FS', function () {
  cy.get('@apiResponse')
    .its('body')
    .then((body) => {
      expect(body).to.be.a('string');
      expect(body.length).to.be.greaterThan(500);
      const jwk = Cypress.env('RSA_ENC_PRIV_KEY');
      cy.task('getJwtContent', { jwk, jwt: body }).then((jwtContent) => {
        const content = JSON.stringify(jwtContent, null, 2);
        cy.document().then((document) => {
          document.documentElement.innerHTML = content;
        });
        cy.get('body')
          .invoke('text')
          .then((json) => JSON.parse(json))
          .as('jwt');
      });
    });
});
