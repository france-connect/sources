import { Then, When } from 'cypress-cucumber-preprocessor/steps';

import {
  getBusinessLogs,
  getValueByKeyFromFirstEvent,
  hasBusinessLog,
  LogResult,
} from '../helpers';

/**
 * Those steps are only runnable on local logs
 */

Then(
  /^l'événement "([^"]+)" (est|n'est pas) journalisé(?: avec )?((?:"[^"]+" "(?:[^"]*)"(?: et )?)+)?$/,
  function (event, text, info) {
    const { name } = this.env;
    if (name !== 'docker') {
      cy.log(
        'aucune validation des événements dans les logs possible en dehors de la stack locale',
      );
      return;
    }

    const valueMapping = {
      false: false,
      'non null': 'RegExp:^.+$',
      null: null,
      true: true,
    };

    const DELIMITOR = ' et ';
    const extraEventVerification = prepareEventVerification(
      info,
      DELIMITOR,
      {},
      valueMapping,
    );
    const expectedEvent: Record<string, unknown> = {
      event,
      ...extraEventVerification,
    };

    const logResult =
      text === 'est' ? LogResult.EventFound : LogResult.EventNotFound;
    hasBusinessLog(expectedEvent, logResult);
  },
);

When(
  /^je mémorise la valeur "([^"]+)" de l'événement "([^"]+)"$/,
  function (key: string, event: string) {
    const { name } = this.env;
    if (name !== 'docker') {
      cy.log(
        'aucune validation des événements dans les logs possible en dehors de la stack locale',
      );
      return;
    }

    getBusinessLogs({
      event,
    }).then((logs) => {
      const value = getValueByKeyFromFirstEvent(key, logs);
      cy.wrap(value).as(`log:${key}`);
    });
  },
);

Then(
  /^la valeur "([^"]+)" est (identique|différente) dans l'événement "([^"]+)"$/,
  function (key: string, text: string, event: string) {
    const { name } = this.env;
    if (name !== 'docker') {
      cy.log(
        'aucune validation des événements dans les logs possible en dehors de la stack locale',
      );
      return;
    }

    const equalNotEqual = text === 'identique' ? 'to.equal' : 'not.to.equal';
    getBusinessLogs({
      event,
    }).then((logs) => {
      const value = getValueByKeyFromFirstEvent(key, logs);
      cy.get(`@log:${key}`).should(equalNotEqual, value);
    });
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

    const DELIMITOR = ' et ';
    const extraEventVerification = prepareEventVerification(
      info,
      DELIMITOR,
      keyMapping,
      valueMapping,
    );
    const expectedEvent: Record<string, unknown> = {
      event,
      ...extraEventVerification,
    };

    const logResult =
      text === 'est' ? LogResult.EventFound : LogResult.EventNotFound;
    hasBusinessLog(expectedEvent, logResult, logPath);
  },
);

const prepareEventVerification = (
  text: string,
  delimitor: string,
  keyMapping: Record<string, string> = {},
  valueMapping: Record<string, unknown> = {},
): Record<string, unknown> => {
  const expectedEvent = {};
  if (text) {
    text.split(delimitor).forEach((infoText) => {
      const result = infoText.match(/^"([^"]+)" "([^"]*)"$/);
      if (result) {
        const [, key, value] = result;
        const technicalKey = keyMapping[key] ?? key;
        const technicalValue =
          valueMapping[value] !== undefined ? valueMapping[value] : value;
        expectedEvent[technicalKey] = technicalValue;
      }
    });
  }
  return expectedEvent;
};
