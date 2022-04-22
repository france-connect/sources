import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

import { navigateTo, User } from '../../common/helpers';
import { Environment } from '../../common/types';
import UdHistoryPage from '../pages/ud-history-page';

let udHistoryPage: UdHistoryPage;

Given(
  'je navigue directement vers la page historique du dashboard usager',
  function () {
    const { allAppsUrl }: Environment = this.env;
    navigateTo({ appId: 'ud-history', baseUrl: allAppsUrl });
  },
);

Given('je navigue vers la page historique du dashboard usager', function () {
  const { allAppsUrl, udRootUrl }: Environment = this.env;
  navigateTo({ appId: 'ud-history', baseUrl: allAppsUrl });
  udHistoryPage = new UdHistoryPage(udRootUrl);
  udHistoryPage.checkIsVisible();
});

Given(
  /^je suis (redirigé vers|sur) la page historique du dashboard usager$/,
  function () {
    const { udRootUrl }: Environment = this.env;
    udHistoryPage = new UdHistoryPage(udRootUrl);
    udHistoryPage.checkIsVisible();
  },
);

Given('les traces FranceConnect+ contiennent {string}', function (tracksType) {
  cy.task('addTracks', { tracksType });
});

Given('les traces FranceConnect contiennent {string}', function (tracksType) {
  cy.task('addTracksLegacy', { tracksType });
});

Then(
  "le nom de l'usager est affiché sur la page historique du dashboard usager",
  function () {
    const { fullName }: User = this.user;
    udHistoryPage.userName.contains(fullName);
  },
);

Then(
  'les {int} traces de FranceConnect de moins de 6 mois sont affichées',
  function (nbOfTraces) {
    udHistoryPage.traces.should('be.visible');
    /**
     * @todo #820
     * analyse type of tracks received (2 FC_VERIFIED + 1 CONSENT)
     *
     * Author: Arnaud PSA
     * Date: 23/02/2022
     */
    udHistoryPage.traces
      .filter('.track-FranceConnect')
      .should('have.length', nbOfTraces);

    udHistoryPage.checkIfBeforeNbOfMonth('.track-FranceConnect', 6);
  },
);

Then(
  'les {int} traces de FranceConnect+ sont affichées',
  function (nbOfTraces) {
    udHistoryPage.traces.should('be.visible');
    /**
     * @todo #820
     * analyse type of tracks received (2 FC_VERIFIED + 1 CONSENT)
     *
     * Author: Arnaud PSA
     * Date: 23/02/2022
     */
    udHistoryPage.traces
      .filter('.track-FranceConnect\\+')
      .should('have.length', nbOfTraces);
  },
);

Then(
  'les {int} traces sont affichées par ordre décroissant',
  function (nbOfTraces) {
    udHistoryPage.traces.should('be.visible');
    /**
     * @todo #820
     * analyse type of tracks received (2 FC_VERIFIED + 1 CONSENT)
     *
     * Author: Arnaud PSA
     * Date: 23/02/2022
     */
    udHistoryPage.traces.should('have.length', nbOfTraces);
    udHistoryPage.checkIfTracksAreSorted();
  },
);
