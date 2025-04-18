import { Then } from '@badeball/cypress-cucumber-preprocessor';

import {
  getAllBusinessLogs,
  hasBusinessLog,
  LogResult,
  prepareEventVerification,
} from '../../common/helpers';
import {
  EIDAS_FLOW_EVENTS_EU_FR,
  EIDAS_FLOW_EVENTS_FR_EU,
} from '../pages/eidas-flow-events';

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
  function (event: string, text: string, info?: string) {
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

/**
 * Used to check the order of events, the presence of all events
 * and the presence of all expected keys in the logs.
 */
Then(
  /^la cohérence des événements de la cinématique FS "(européen|français)" est respectée$/,
  function (spSource) {
    const logPath = Cypress.env('EIDAS_LOG_FILE_PATH');
    const { name } = this.env;
    if (name !== 'docker') {
      cy.log(
        'aucune validation des événements dans les logs possible en dehors de la stack locale',
      );
      return;
    }

    let expectedEvents;

    switch (spSource) {
      case 'européen':
        expectedEvents = EIDAS_FLOW_EVENTS_FR_EU;
        break;
      case 'français':
        expectedEvents = EIDAS_FLOW_EVENTS_EU_FR;
        break;
      default:
        expect(spSource).to.be.oneOf(['européen', 'français']);
    }

    expect(expectedEvents).not.to.be.undefined;

    getAllBusinessLogs(logPath).then((logs) => {
      // Need te re-reverse the logs to have them in the right order (most recent last)
      const orderedLogs = logs.reverse();

      expectedEvents.forEach(
        ({ event: expectedEvent, keys: expectedKeys }, index) => {
          const currentEvent = orderedLogs[index]?.event;
          const currentKeys = Object.keys(orderedLogs[index]);

          expect(currentEvent).to.equal(
            expectedEvent,
            `l'événement ${expectedEvent} n'est pas cohérent. Log: ${currentEvent} / Référence: ${expectedEvent}. Quelque chose à cassé la cinématique et / ou les variables d'env FLOW_CONSISTENCY_* ne sont pas à jour.`,
          );
          expect(currentKeys).to.deep.equal(
            expectedKeys,
            `les clés de l'événement ${expectedEvent} ne sont pas cohérentes. Log: ${currentKeys} / Référence: ${expectedKeys}. Quelque chose à cassé la cinématique et / ou les variables d'env FLOW_CONSISTENCY_* ne sont pas à jour.`,
          );
        },
      );
    });
  },
);
