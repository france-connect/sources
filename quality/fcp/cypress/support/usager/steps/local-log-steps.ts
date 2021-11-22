import { Then } from 'cypress-cucumber-preprocessor/steps';

import { hasBusinessLog, LogResult } from '../../common/helpers';

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
