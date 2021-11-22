import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

import { User } from '../../common/helpers';
import { Environment } from '../../common/types';
import UdHistoryPage from '../pages/ud-history-page';

let udHistoryPage: UdHistoryPage;

Given(
  'je suis redirigé vers la page historique du dashboard usager',
  function () {
    const { udRootUrl }: Environment = this.env;
    udHistoryPage = new UdHistoryPage(udRootUrl);
    udHistoryPage.checkIsVisible();
  },
);

Given('les traces contiennent {string}', function (tracksType) {
  cy.task('addTracks', { tracksType });
});

Then(
  "le nom de l'usager est affiché sur la page historique du dashboard usager",
  function () {
    const { fullName }: User = this.user;
    udHistoryPage.userName.contains(fullName);
  },
);

Then('les traces de connexion sont affichées', function () {
  udHistoryPage.traces.should('be.visible');
});
