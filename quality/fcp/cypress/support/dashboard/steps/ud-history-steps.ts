import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

import { navigateTo } from '../../common/helpers';
import { Environment } from '../../common/types';
import UdEventCard from '../pages/ud-event-card-component';
import UdHistoryPage from '../pages/ud-history-page';

let udHistoryPage: UdHistoryPage;
let currentEventCard: UdEventCard;

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

Given('les traces sont récupérées dans elasticsearch', function () {
  cy.task('removeTracks');
  cy.task('removeTracksLegacy');
  cy.task('injectTracksLegacy');
});

Given('les traces FranceConnect+ contiennent {string}', function (tracksType) {
  cy.task('removeTracks');
  cy.task('addTracks', { tracksType });
});

Given('les traces FranceConnect contiennent {string}', function (tracksType) {
  cy.task('removeTracksLegacy');
  cy.task('addTracksLegacy', { tracksType });
});

Then(
  /^les (\d+) traces de (FranceConnect) de moins de (\d+) mois sont affichées$/,
  function (count, platform, month) {
    udHistoryPage.getAllEventCards().should('be.visible');
    udHistoryPage
      .getAllEventCardsForPlatform(platform)
      .should('have.length', count);
    udHistoryPage.checkIfBeforeNbOfMonth(platform, month);
  },
);

Then(
  /^les (\d+) traces de (FranceConnect|FranceConnect\+) sont affichées$/,
  function (count, platform) {
    udHistoryPage.getAllEventCards().should('be.visible');
    udHistoryPage
      .getAllEventCardsForPlatform(platform)
      .should('have.length', count);
  },
);

Then(
  'les {int} traces sont affichées par ordre décroissant',
  function (nbOfTraces) {
    udHistoryPage.getAllEventCards().should('be.visible');
    udHistoryPage.getAllEventCards().should('have.length', nbOfTraces);
    udHistoryPage.checkIfTracksAreSorted();
  },
);

Then(
  /^(\d+) évènements? de traces (?:est|sont) affichés?$/,
  function (cardCount) {
    udHistoryPage.getAllEventCards().should('have.length', cardCount);
  },
);

When(/^j'affiche le détail de tous les évènements$/, function () {
  udHistoryPage.getAllEventCards().each(($el) => $el.trigger('click'));
});

When(
  /^j'affiche le détail du dernier évènement "([^"]*)" sur "([^"]*)" du fournisseur de service "([^"]*)"$/,
  function (actionType, plateform, spTitle) {
    udHistoryPage
      .findEventCard(plateform, actionType, spTitle)
      .then((eventCard) => {
        expect(eventCard).to.exist;
        currentEventCard = eventCard;
        currentEventCard.getCardButton().click();
      });
  },
);

When(
  /^j'affiche le détail du (\d+)\D+ évènement "([^"]*)" sur "([^"]*)" du fournisseur de service "([^"]*)"$/,
  function (eventIndex, actionType, plateform, spTitle) {
    udHistoryPage
      .findEventCard(plateform, actionType, spTitle, eventIndex)
      .then((eventCard) => {
        expect(eventCard).to.exist;
        currentEventCard = eventCard;
        currentEventCard.getCardButton().click();
      });
  },
);

Then(/^la plateforme de l'évènement est "([^"]*)"$/, function (platform) {
  currentEventCard.getPlatformBadge().should('have.text', platform);
});

Then(/^le type d'action de l'évènement est "([^"]*)"$/, function (actionType) {
  currentEventCard.getActionTypeBadge().should('have.text', actionType);
});

Then(/^la date de l'évènement est affichée$/, function () {
  currentEventCard.checkEventDateIsDisplayed();
});

Then(/^la date de l'évènement correspond à aujourd'hui$/, function () {
  currentEventCard.checkEventDateIsToday();
});

Then(
  /^le fournisseur de service de l'évènement est "([^"]*)"$/,
  function (spTitle) {
    currentEventCard.getSpTitleLabel().should('have.text', spTitle);
  },
);

Then(/^la date et heure de connexion sont affichées$/, function () {
  currentEventCard.checkConnectionDatetimeIsDisplayed();
});

Then(/^la date et heure de connexion correspondent à maintenant$/, function () {
  currentEventCard.checkConnectionDatetimeIsNow();
});

Then(/^la date et heure de l'évènement sont affichées$/, function () {
  currentEventCard.checkClaimsDateIsDisplayed();
});

Then(
  /^la date et heure de l'évènement correspondent à maintenant$/,
  function () {
    currentEventCard.checkClaimsDateIsNow();
  },
);

Then(
  /^la localisation de l'évènement (est|n'est pas) affichée$/,
  function (text) {
    const isVisible = text === 'est';
    if (isVisible) {
      currentEventCard.checkLocationIsDisplayed();
    } else {
      currentEventCard.getLocationLabel().should('not.exist');
    }
  },
);

Then(
  /^le nom du fournisseur d'identité de l'évènement est "([^"]*)"$/,
  function (idpName) {
    currentEventCard.getIdpNameLabel().should('have.text', idpName);
  },
);

Then(
  /^le niveau de sécurité de l'évènement est "([^"]*)"$/,
  function (eidasLevel) {
    currentEventCard.getEidasLabel().should('have.text', eidasLevel);
  },
);

Then(
  /^les données "([^"]*)" de l'évènement contiennent "([^"]*)"$/,
  function (fdName, claimTitle) {
    currentEventCard
      .getClaimsList(fdName)
      .invoke('text')
      .should('include', claimTitle);
  },
);

Then(/^l'évènement concerne aucune donnée "([^"]*)"$/, function (fdName) {
  currentEventCard.getClaimsTitleLabel(fdName).should('not.exist');
  currentEventCard.getClaimsList(fdName).should('not.exist');
});

Then(
  /^l'évènement concerne (\d+) données? "([^"]*)"$/,
  function (claimsCount, fdName) {
    currentEventCard.getClaimsTitleLabel(fdName).should('be.visible');
    currentEventCard.getClaimsList(fdName).should('have.length', claimsCount);
  },
);
