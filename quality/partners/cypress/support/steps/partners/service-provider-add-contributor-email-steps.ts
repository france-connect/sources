import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

import ServiceProviderAddContributorEmailPage from '../../pages/service-provider-add-contributor-email';

const serviceProviderAddContributorEmailPage =
  new ServiceProviderAddContributorEmailPage();

Given('je supprime les mails envoyés à {string}', function (email: string) {
  serviceProviderAddContributorEmailPage.deleteMessagesSentTo(email);
  // Wait for the maildev delete requests to complete
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
});

Then(
  'le mail "ajout de contributeur" est envoyé à {string}',
  function (email: string) {
    // Wait for the email to reach maildev
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    serviceProviderAddContributorEmailPage.visitLastMessageSentTo(email);
    // Wait for the mail content (and images) to render before asserting/screenshot
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300);
  },
);

Then(
  `l'administrateur est {string} dans le mail "ajout de contributeur"`,
  function (adminName: string) {
    serviceProviderAddContributorEmailPage.checkAdminNameContains(adminName);
  },
);

Then(
  'le fournisseur de service est {string} dans le mail "ajout de contributeur"',
  function (serviceProviderName: string) {
    serviceProviderAddContributorEmailPage.checkServiceProviderNameContains(
      serviceProviderName,
    );
  },
);
