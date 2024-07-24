import { Then } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderErrorPage from '../pages/service-provider-error-page';

const serviceProviderErrorPage = new ServiceProviderErrorPage();

Then(
  /^l'entête de la réponse a une propriété "location" contenant l'url de callback du FS avec l'erreur( \(fragment\))?$/,
  function (text: string) {
    const containsQuery = !text;
    cy.get('@apiResponse')
      .its('headers')
      .its('location')
      .then((url) => {
        serviceProviderErrorPage.checkErrorCallbackUrl(url, containsQuery);
      });
  },
);
