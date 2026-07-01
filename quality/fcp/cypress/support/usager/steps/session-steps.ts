import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given(
  /^je paramètre un intercepteur pour accélérer l'alerte "session bientôt expirée" sur la page (sélection du fournisseur d'identité|d'information|de consentement)$/,
  function (page: string) {
    const { fcRootUrl } = this.env;

    const pageUrlMap = {
      "d'information": '/api/v2/interaction/*/consent',
      'de consentement': '/api/v2/interaction/*/consent',
      "sélection du fournisseur d'identité": '/api/v2/interaction/*',
    };
    expect(page in pageUrlMap, `The page '${page}' doesn't exist`).to.be.true;
    const key = page as keyof typeof pageUrlMap;
    const pageUrl = pageUrlMap[key];

    const url = `${fcRootUrl}${pageUrl}`;
    cy.intercept(url, (req) => {
      req.continue((res) => {
        if (typeof res.body === 'string') {
          // Replace the session-alert-delay input by a hidden input with a short delay to speed up tests
          const targetRegex = /<input[^>]*session-alert-delay[^>]*>/;
          const resBody = res.body.replace(
            targetRegex,
            `<input type="hidden" id="session-alert-delay" value="5">`,
          );
          res.send(resBody);
        }
      });
    }).as('FC:SessionAlert');
  },
);

Then(
  /^l'alerte "session bientôt expirée" (est|n'est pas) affichée$/,
  function (text: string) {
    const shouldBeVisible = text === 'est' ? 'be.visible' : 'not.be.visible';
    cy.get('#session-expiration-alert-live-region').should(shouldBeVisible);
  },
);

Then(
  /^l'alerte "session bientôt expirée" sera affichée dans (\d+) (secondes|minutes)$/,
  function (delay: number, unit: string) {
    const delayInSeconds = unit === 'minutes' ? delay * 60 : delay;
    cy.get('#session-alert-delay').should(
      'have.value',
      delayInSeconds.toString(),
    );
  },
);

Then(
  /^l'alerte "session bientôt expirée" contient le texte "([^"]*)?"$/,
  function (expectedText: string) {
    const normalizeText = (text: string) =>
      text
        .replace(/\u00A0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    cy.get('#session-expiration-alert-live-region')
      .invoke('text')
      .then((actualText) => {
        expect(normalizeText(actualText)).to.contain(
          normalizeText(expectedText),
        );
      });
  },
);
