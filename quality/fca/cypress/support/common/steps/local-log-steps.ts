import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

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
  function (event: string, text: string, info?: string) {
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
