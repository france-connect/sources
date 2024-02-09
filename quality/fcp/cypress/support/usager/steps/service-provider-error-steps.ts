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

Then(
  'l\'url de callback du FS a un paramètre "error" égal à {string}',
  function (error: string) {
    cy.get('@apiResponse')
      .its('headers')
      .its('location')
      .then((url) => {
        serviceProviderErrorPage.checkErrorInCallbackUrl(url, error);
      });
  },
);

Then(
  'l\'url de callback du FS a un paramètre "error_description" égal à {string}',
  function (errorDescription: string) {
    cy.get('@apiResponse')
      .its('headers')
      .its('location')
      .then((url) => {
        serviceProviderErrorPage.checkErrorDescriptionInCallbackUrl(
          url,
          errorDescription,
        );
      });
  },
);

Then(
  'je suis redirigé vers la page erreur du fournisseur de service',
  function () {
    serviceProviderErrorPage.checkIsVisible();
  },
);

Then(
  "le titre de l'erreur fournisseur de service est {string}",
  function (errorCode: string) {
    serviceProviderErrorPage.checkErrorCode(errorCode);
  },
);

Then(
  "la description de l'erreur fournisseur de service est {string}",
  function (errorDescription: string) {
    serviceProviderErrorPage.checkErrorDescription(errorDescription);
  },
);
