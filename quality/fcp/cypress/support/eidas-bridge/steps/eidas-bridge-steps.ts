import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

import EidasBridgePage from '../pages/eidas-bridge-page';

const eidasBridgePage = new EidasBridgePage();

Then('je suis redirigé vers la page sélection du pays', function () {
  eidasBridgePage.checkIsVisible();
});

When('je clique sur le pays {string}', function (country: string) {
  eidasBridgePage.getCountryButton(country).click();
});

Then(
  "le refus d'authentification eidas est {string}",
  function (message: string) {
    cy.wait('@fc:oidcCallback')
      .its('request.query')
      .then(({ error, error_description, state }) => {
        expect(error).to.equal('eidas_node_error');
        expect(error_description).to.equal(
          `StatusCode: Responder\nSubStatusCode: RequestDenied\nStatusMessage: ${message}`,
        );
        expect(state).to.exist;
      });
  },
);

Then(
  "l'erreur d'authentification eidas est {string}",
  function (message: string) {
    cy.wait('@fc:oidcCallback')
      .its('request.query')
      .then(({ error, error_description, state }) => {
        expect(error).to.equal('eidas_node_error');
        expect(error_description).to.equal(
          `StatusCode: Responder\nStatusMessage: ${message}`,
        );
        expect(state).to.exist;
      });
  },
);
