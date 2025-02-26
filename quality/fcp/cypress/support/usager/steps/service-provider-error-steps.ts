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
  "l'url de callback du FS a les paramètres {string}",
  function (text: string) {
    const expectedParams = text.split(',');
    cy.get('@apiResponse')
      .its('headers')
      .its('location')
      .then((location: string): void => {
        const url = new URL(location);
        // check that all received params are expected and have a value
        for (const [key, value] of url.searchParams.entries()) {
          expect(expectedParams).to.include(key);
          expect(value).to.be.ok;
        }
        // check that we received all expected params
        const actualParamKeys = Array.from(url.searchParams.keys());
        expect(actualParamKeys).to.have.members(expectedParams);
      });
  },
);

Then(
  "l'url de callback du FS a un paramètre {string} égal à {string}",
  function (key: string, value: string) {
    cy.get('@apiResponse')
      .its('headers')
      .its('location')
      .then((url) => {
        serviceProviderErrorPage.checkParamInCallbackUrl(url, key, value);
      });
  },
);

Then(
  'l\'url fragment de callback du FS a un paramètre "error" égal à {string}',
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
  'l\'url fragment de callback du FS a un paramètre "error_description" égal à {string}',
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

Then(
  "l'url de la page erreur du fournisseur de service a les paramètres {string}",
  function (text: string) {
    const expectedParams = text.split(',');
    cy.url().then((href: string): void => {
      const url = new URL(href);
      // check that all received params are expected and have a value
      for (const [key, value] of url.searchParams.entries()) {
        expect(expectedParams).to.include(key);
        expect(value).to.be.ok;
      }
      // check that we received all expected params
      const actualParamKeys = Array.from(url.searchParams.keys());
      expect(actualParamKeys).to.have.members(expectedParams);
    });
  },
);
