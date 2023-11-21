import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import SPDetailPage from '../pages/sp-detail-page';
import { Environment } from '../types';

const spDetail = new SPDetailPage();

Given(
  /^je réinitialise la base de données pour les tests de configuration$/,
  function () {
    const { partnersBackAppId }: Environment = this.env;
    cy.task('resetDbSPConfigurations', partnersBackAppId);
  },
);

Then(/^aucune configuration de test n'est listée$/, function () {
  spDetail.getAllSPConfigurations().should('have.length', 0);
});

Then(
  /^(\d+) configurations? de test (?:est|sont) listées?$/,
  function (count: number) {
    spDetail.getAllSPConfigurations().should('have.length', count);
  },
);

Then(/^le bouton ajouter une configuration de test est affiché$/, function () {
  spDetail.getAddSPConfigurationButton().should('be.visible');
});

When(
  /^je clique sur le bouton ajouter une configuration de test$/,
  function () {
    spDetail.getAddSPConfigurationButton().click();
  },
);

Then(
  /^le nom de la (\d+)\S+ configuration de test est "([^"]+)"$/,
  function (index: number, configName: string) {
    spDetail
      .getSPConfiguration(index - 1)
      .getTitle()
      .should('have.text', configName);
  },
);
