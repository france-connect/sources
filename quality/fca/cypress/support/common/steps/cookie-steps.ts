import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import {
  checkCookieExists,
  getCookieFromUrl,
  setUnknowSessionIdInSessionCookie,
} from '../helpers';

Then(
  /^le cookie "([^"]+)" est (présent|absent|supprimé)$/,
  function (cookieName: string, text: string) {
    const existNotExist = text === 'présent' ? 'exist' : 'not.exist';
    const { fcaRootUrl } = this.env;
    getCookieFromUrl(cookieName, fcaRootUrl).should(existNotExist);
  },
);

When(
  /^je mémorise la valeur du cookie "([^"]+)"$/,
  function (cookieName: string) {
    const { fcaRootUrl } = this.env;
    getCookieFromUrl(cookieName, fcaRootUrl)
      .should('exist')
      .as(`cookie:${cookieName}`);
  },
);

Then(
  /^la valeur du cookie "([^"]+)" est (identique|différente)$/,
  function (cookieName: string, text: string) {
    const { fcaRootUrl } = this.env;
    const equalNotEqual = text === 'identique' ? 'equal' : 'not.equal';
    cy.get<Cypress.Cookie>(`@cookie:${cookieName}`).then((previousCookie) => {
      expect(previousCookie).to.exist;
      const { value: previousValue } = previousCookie;

      getCookieFromUrl(cookieName, fcaRootUrl)
        .should('exist')
        .its('value')
        .should(equalNotEqual, previousValue);
    });
  },
);

Given('je supprime tous les cookies', function () {
  cy.clearAllCookies();
});

Then('les cookies AgentConnect sont présents', function () {
  const { fcaRootUrl, name } = this.env;
  const url = new URL(fcaRootUrl);
  const domain = url.hostname;

  checkCookieExists('fc_session_id', domain);

  cy.getCookies({ domain })
    .should('have.length', 5)
    .then((cookies: Cypress.Cookie[]) => {
      // FC cookies are intercepted by Cypress on integ01.
      // We force sameSite=none to test cross-domain.
      // The sameSite check can only be done on the docker environment.
      if (name === 'docker') {
        cookies.forEach((cookie) =>
          expect(cookie).to.have.property('sameSite', 'lax'),
        );
      }
    });
});

When(
  'je force un sessionId inexistant dans le cookie de session AgentConnect',
  function () {
    const { fcaRootUrl } = this.env;
    setUnknowSessionIdInSessionCookie(fcaRootUrl);
  },
);

Given('je supprime les cookies AgentConnect', function () {
  const { fcaRootUrl } = this.env;
  const url = new URL(fcaRootUrl);
  const domain = url.hostname;
  cy.clearCookies({ domain });
});
