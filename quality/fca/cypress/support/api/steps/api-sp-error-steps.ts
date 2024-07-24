import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then(
  'l\'entête de la réponse a une propriété "location" contenant l\'url de callback du FS avec une erreur',
  function () {
    cy.get('@apiResponse')
      .its('headers')
      .its('location')
      .then((url) => {
        const match = url.match(
          /^https:\/\/.*\/oidc-callback([?#])error=([^&]+)&error_description=([^&]+)&state=[^&]+&iss=[^&]+$/,
        );
        expect(match?.length).to.equal(4);
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
        expect(url).to.contain(`error=${error}`);
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
        expect(url).to.contain(
          `error_description=${encodeURIComponent(errorDescription)}`,
        );
      });
  },
);
