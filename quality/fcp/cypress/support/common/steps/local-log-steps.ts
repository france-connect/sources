import { Then } from 'cypress-cucumber-preprocessor/steps';

import { hasBusinessLog, LogResult } from '../helpers';

/**
 * Those steps are only runnable on local logs
 */

Then(
  /^l'événement "([^"]+)" (est|n'est pas) déclenché$/,
  function (event, text) {
    const { name } = this.env;
    if (name !== 'docker') {
      cy.log(
        'aucune validation des événements dans les logs possible en dehors de la stack locale',
      );
      return;
    }
    const logResult =
      text === 'est' ? LogResult.EventFound : LogResult.EventNotFound;
    const { idpId } = this.identityProvider;
    hasBusinessLog(
      {
        event,
        idpId,
      },
      logResult,
    );
  },
);

/**
 * Usage examples:
 * - simple validation of the presence of an event in the log
 * l'événement eIDAS "RECEIVED_FC_AUTH_CODE" est journalisé
 *
 * - validation of the presence of an event with a technical attribute (here "category")
 * l'événement eIDAS "INCOMING_EIDAS_REQUEST" est journalisé avec "category" "EU_REQUEST"
 *
 * - validation of the presence of an event with multiple attribute including a functional key alias ("pays destination" alias for "countryCodeDst")
 * l'événement eIDAS "INCOMING_EIDAS_REQUEST" est journalisé avec "category" "EU_REQUEST" et "pays destination" "FR"
 *
 * - validation of the presence of an event with an attribute using a functional value alias ("généré par FC" alias for the regular expression /^[0-9a-f]{64}v1$/ )
 * l'événement eIDAS "REDIRECTING_TO_EIDAS_FR_NODE" est journalisé avec "sub du FS" "généré par FC"
 */
Then(
  /^l'événement eIDAS "([^"]+)" (est|n'est pas) journalisé(?: avec )?((?:"[^"]+" "(?:[^"]*)"(?: et )?)+)?$/,
  function (event, text, info) {
    const logPath = Cypress.env('EIDAS_LOG_FILE_PATH');
    const { name } = this.env;
    if (name !== 'docker') {
      cy.log(
        'aucune validation des événements dans les logs possible en dehors de la stack locale',
      );
      return;
    }

    const keyMapping = {
      'niveau eIDAS demandé': 'eidasLevelRequested',
      'niveau eIDAS reçu': 'eidasLevelReceived',
      'pays destination': 'countryCodeDst',
      'pays source': 'countryCodeSrc',
      'sub du FI': 'idpSub',
      'sub du FS': 'spSub',
    };

    const valueMapping = {
      'transmis par FC': 'RegExp:^[0-9a-f]{64}v1$',
      'transmis par eIDAS': 'RegExp:^[A-Z]{2}/FR/[0-9a-f]+$',
    };

    const expectedEvent: Record<string, unknown> = { event };
    if (info) {
      info.split(' et ').forEach((infoText) => {
        const result = infoText.match(/^"([^"]+)" "([^"]*)"$/);
        if (result) {
          const [, key, value] = result;
          const technicalKey = keyMapping[key] || key;
          const technicalValue = valueMapping[value] || value;
          expectedEvent[technicalKey] = technicalValue;
        }
      });
    }

    const logResult =
      text === 'est' ? LogResult.EventFound : LogResult.EventNotFound;
    hasBusinessLog(expectedEvent, logResult, logPath);
  },
);
