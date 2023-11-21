import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { getCookieFromUrl } from '../helpers';
import { Environment } from '../types';

Then(
  /^le cookie "([^"]+)" est (présent|absent|supprimé)$/,
  function (cookieName: string, text: string) {
    const existNotExist = text === 'présent' ? 'exist' : 'not.exist';
    const { fcRootUrl }: Environment = this.env;
    getCookieFromUrl(cookieName, fcRootUrl).should(existNotExist);
  },
);

When(
  /^je mémorise la valeur du cookie "([^"]+)"$/,
  function (cookieName: string) {
    const { fcRootUrl }: Environment = this.env;
    getCookieFromUrl(cookieName, fcRootUrl)
      .should('exist')
      .as(`cookie:${cookieName}`);
  },
);

Then(
  /^la valeur du cookie "([^"]+)" est (identique|différente)$/,
  function (cookieName: string, text: string) {
    const { fcRootUrl }: Environment = this.env;
    const equalNotEqual = text === 'identique' ? 'equal' : 'not.equal';
    cy.get<Cypress.Cookie>(`@cookie:${cookieName}`).then((previousCookie) => {
      expect(previousCookie).to.exist;
      const { value: previousValue } = previousCookie;

      getCookieFromUrl(cookieName, fcRootUrl)
        .should('exist')
        .its('value')
        .should(equalNotEqual, previousValue);
    });
  },
);

Given('je supprime tous les cookies', function () {
  cy.clearAllCookies();
});
