import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import { clearAllCookies } from '../helpers';

Then(
  /^le cookie "([^"]+)" est (présent|absent|supprimé)$/,
  function (cookieName: string, text: string) {
    const shouldExist = text === 'présent';
    cy.getCookie(cookieName).then((cookie) => {
      if (shouldExist) {
        expect(cookie).to.exist;
      } else {
        expect(cookie).not.to.be.ok;
      }
    });
  },
);

When(
  /^je mémorise la valeur du cookie "([^"]+)"$/,
  function (cookieName: string) {
    cy.getCookie(cookieName).then((cookie) => {
      expect(cookie).to.exist;
      cy.wrap(cookie).as(`cookie:${cookieName}`);
    });
  },
);

Then(
  /^la valeur du cookie "([^"]+)" est (identique|différente)$/,
  function (cookieName: string, text: string) {
    const shouldBeEqual = text === 'identique';
    cy.get<Cypress.Cookie>(`@cookie:${cookieName}`).then((previousCookie) => {
      expect(previousCookie).to.exist;
      const { value: previousValue } = previousCookie;

      cy.getCookie(cookieName).then((cookie) => {
        expect(cookie).to.exist;
        const { value } = cookie;
        if (shouldBeEqual) {
          expect(value).to.equal(previousValue);
        } else {
          expect(value).not.to.equal(previousValue);
        }
      });
    });
  },
);

Given('je supprime tous les cookies', function () {
  clearAllCookies();
});
