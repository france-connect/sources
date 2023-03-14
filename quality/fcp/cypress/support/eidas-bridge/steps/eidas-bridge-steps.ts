import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import { Environment } from '../../common/types';
import EidasBridgePage from '../pages/eidas-bridge-page';

const eidasBridgePage = new EidasBridgePage();

Then('je suis redirigé vers la page sélection du pays', function () {
  eidasBridgePage.checkIsVisible();
});

When('je clique sur le pays {string}', function (country) {
  eidasBridgePage.getCountryButton(country).click();
});

Then("je suis redirigé vers la page d'erreur eidas-bridge", function () {
  const { fcRootUrl }: Environment = this.env;
  cy.url().should(
    'includes',
    `${fcRootUrl}/api/v2/oidc-callback?error=eidas_node_error`,
  );
});

Then("le refus d'authentification eidas est {string}", function (message) {
  const encodedMessage = encodeURIComponent(message);
  const urlParamsString = `&error_description=StatusCode%3A%20Responder%0ASubStatusCode%3A%20RequestDenied%0AStatusMessage%3A%20${encodedMessage}&state=`;
  cy.url().should('includes', urlParamsString);
});

Then("l'erreur d'authentification eidas est {string}", function (message) {
  const encodedMessage = encodeURIComponent(message);
  const urlParamsString = `&error_description=StatusCode%3A%20Responder%0AStatusMessage%3A%20${encodedMessage}&state=`;
  cy.url().should('includes', urlParamsString);
});
