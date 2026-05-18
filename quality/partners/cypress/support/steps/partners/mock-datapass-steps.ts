import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { navigateTo } from '../../helpers';
import MockDatapassPage from '../../pages/mock-datapass-page';

const mockDatapassPage = new MockDatapassPage();

Given('je navigue sur la page mock Datapass', function () {
  const { allAppsUrl } = this.env;
  navigateTo({ appId: 'mock-datapass', baseUrl: allAppsUrl });
});

When(
  /^je déclenche un événement "(approve)" Datapass pour le fournisseur de service$/,
  function (eventType: string) {
    const basePayload = this.datapassEvents[eventType];
    expect(basePayload).to.exist;
    expect(this.serviceProvider).to.exist;

    mockDatapassPage.fillPayload(basePayload, this.serviceProvider, this.users);

    mockDatapassPage.getSubmitButton().click();
  },
);

Then(
  'le statut de la réponse du webhook Datapass est {string}',
  function (status: string) {
    mockDatapassPage.getResponseStatusCodeLabel().should('contain', status);
  },
);

Then(
  'le corps de la réponse du webhook Datapass contient {string}',
  function (text: string) {
    mockDatapassPage.getResponseBodyLabel().should('contain', text);
  },
);

Given(
  /^je mémorise l'identifiant du fournisseur de service de la réponse du webhook Datapass$/,
  function () {
    mockDatapassPage
      .getResponseBodyLabel()
      .invoke('text')
      .then((text) => {
        // Webhook Datapass
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { token_id } = JSON.parse(text);
        cy.wrap(token_id).as('serviceProviderId');
      });
  },
);
