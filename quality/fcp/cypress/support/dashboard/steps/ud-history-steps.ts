import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { navigateTo } from '../../common/helpers';
import { Environment } from '../../common/types';
import UdEventCard from '../pages/ud-event-card-component';
import UdHistoryPage from '../pages/ud-history-page';
import UdPagination from '../pages/ud-pagination-component';

let udHistoryPage: UdHistoryPage;
let currentEventCard: UdEventCard;
const udPagination = new UdPagination();

Given(
  'je navigue directement vers la page historique du dashboard usager',
  function () {
    const { allAppsUrl }: Environment = this.env;
    navigateTo({ appId: 'ud-history', baseUrl: allAppsUrl });
    // Wait for the connection history loading
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  },
);

Given('je navigue vers la page historique du dashboard usager', function () {
  const { allAppsUrl, udRootUrl }: Environment = this.env;
  navigateTo({ appId: 'ud-history', baseUrl: allAppsUrl });
  udHistoryPage = new UdHistoryPage(udRootUrl);
  udHistoryPage.checkIsVisible();
  // Wait for the connection history loading
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
});

Given(
  /^je suis (redirigé vers|sur) la page historique du dashboard usager$/,
  function () {
    const { udRootUrl }: Environment = this.env;
    udHistoryPage = new UdHistoryPage(udRootUrl);
    udHistoryPage.checkIsVisible();
    // Wait for the connection history loading
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
  },
);

Given('les traces sont récupérées dans elasticsearch', function () {
  cy.task('removeTracks');
  cy.task('removeTracksLegacy');
  cy.task('injectTracksLegacy');
});

Given(
  /^les traces "(FranceConnect\(v2\)|FranceConnect\(CL\)|FranceConnect\+|FranceConnect\(CL\) et FranceConnect\+)" contiennent "([^"]+)"$/,
  function (platform: string, description: string) {
    let tracksType = description;

    // Divide the connections between the 2 platforms
    if (platform === 'FranceConnect(CL) et FranceConnect+') {
      const result = tracksType.match(/^(\d+) connexions$/);
      if (result) {
        const connectionCount = parseInt(result[1], 10);
        tracksType = `${connectionCount / 2} connexions`;
      }
    }

    // Remove all tracks
    cy.task('removeTracksLegacy');
    cy.task('removeTracks');

    switch (platform) {
      case 'FranceConnect(CL)':
        cy.task('addTracksLegacy', { tracksType });
        break;
      case 'FranceConnect+':
        cy.task('addTracks', { mockSet: 'high', tracksType });
        break;
      case 'FranceConnect(v2)':
        cy.task('addTracks', { mockSet: 'low', tracksType });
        break;
      default:
        cy.task('addTracksLegacy', { tracksType });
        cy.task('addTracks', { tracksType });
        break;
    }
  },
);

Then(
  /^les évènements "(FranceConnect|FranceConnect\+)" ont moins de (\d+) mois$/,
  function (platform: string, month: number) {
    udHistoryPage.checkIfBeforeNbOfMonth(platform, month);
  },
);

Then(
  /^(\d+) évènements? "([^"]+)" (?:est|sont) affichés?$/,
  function (count: number, platform: string) {
    udHistoryPage.getAllEventCards().should('be.visible');
    if (['FranceConnect', 'FranceConnect+'].includes(platform)) {
      udHistoryPage
        .getAllEventCardsForPlatform(platform)
        .should('have.length', count);
    } else {
      udHistoryPage.getAllEventCards().should('have.length', count);
    }
  },
);

// Event order

Then('les évènements sont affichés par ordre décroissant', function () {
  udHistoryPage.checkIfEventsAreSortedOnCurrentPage();

  udHistoryPage.checkIfEventsAreSortedSinceLastCall();
});

// Pagination

When(
  /^je navigue vers la (première page|page précédente|page suivante|dernière page|page \d+) de l'historique$/,
  function (pageDescription: string) {
    udPagination.getPaginationButton(pageDescription).click();
  },
);

Then(
  "la page {int} est sélectionnée dans la pagination de l'historique",
  function (pageNumber: number) {
    udPagination.checkCurrentPageNumber(pageNumber);
  },
);

Then(
  /^le bouton (première page|page précédente|page suivante|dernière page|page \d+) de l'historique est affiché$/,
  function (pageDescription: string) {
    udPagination.getPaginationButton(pageDescription).should('be.visible');
  },
);

Then(
  /^les navigations (autorisées|désactivées) dans la pagination de l'historique sont "([^"]+)"$/,
  function (status: string, buttonsDescription: string) {
    const areEnabled = status === 'autorisées';
    udPagination.checkPaginationButtonsStatus(buttonsDescription, areEnabled);
  },
);

// Event Cards detail

When(/^j'affiche le détail de tous les évènements$/, function () {
  udHistoryPage.getAllEventCards().each(($el) => $el.trigger('click'));
});

When(
  /^j'affiche le détail du dernier évènement "([^"]*)" sur "([^"]*)" du fournisseur de service "([^"]*)"$/,
  function (actionType: string, plateform: string, spTitle: string) {
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
  function (
    eventIndex: number,
    actionType: string,
    plateform: string,
    spTitle: string,
  ) {
    udHistoryPage
      .findEventCard(plateform, actionType, spTitle, eventIndex)
      .then((eventCard) => {
        expect(eventCard).to.exist;
        currentEventCard = eventCard;
        currentEventCard.getCardButton().click();
      });
  },
);

Then(
  /^la plateforme de l'évènement est "([^"]*)"$/,
  function (platform: string) {
    currentEventCard.getPlatformBadge().should('have.text', platform);
  },
);

Then(
  /^le type d'action de l'évènement est "([^"]*)"$/,
  function (actionType: string) {
    currentEventCard.getActionTypeBadge().should('have.text', actionType);
  },
);

Then(/^la date de l'évènement est affichée$/, function () {
  currentEventCard.checkEventDateIsDisplayed();
});

Then(/^la date de l'évènement correspond à aujourd'hui$/, function () {
  currentEventCard.checkEventDateIsToday();
});

Then(
  /^le fournisseur de service de l'évènement est "([^"]*)"$/,
  function (spTitle: string) {
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
  function (text: string) {
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
  function (idpName: string) {
    currentEventCard.getIdpNameLabel().should('have.text', idpName);
  },
);

Then(
  /^le niveau de sécurité de l'évènement est "([^"]*)"$/,
  function (eidasLevel: string) {
    currentEventCard.getEidasLabel().should('have.text', eidasLevel);
  },
);

Then(
  /^les données "([^"]*)" de l'évènement contiennent "([^"]*)"$/,
  function (fdName: string, claimTitle: string) {
    currentEventCard
      .getClaimsList(fdName)
      .invoke('text')
      .should('include', claimTitle);
  },
);

Then(
  /^l'évènement concerne aucune donnée "([^"]*)"$/,
  function (fdName: string) {
    currentEventCard.getClaimsTitleLabel(fdName).should('not.exist');
    currentEventCard.getClaimsList(fdName).should('not.exist');
  },
);

Then(
  /^l'évènement concerne (\d+) données? "([^"]*)"$/,
  function (claimsCount: number, fdName: string) {
    currentEventCard.getClaimsTitleLabel(fdName).should('be.visible');
    currentEventCard.getClaimsList(fdName).should('have.length', claimsCount);
  },
);
