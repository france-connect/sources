import { When } from '@badeball/cypress-cucumber-preprocessor';

import { navigateTo } from '../../common/helpers';

When("je navigue sur la page d'accueil de Nexus", function () {
  const { allAppsUrl, nexusAppId, nexusRootUrl } = this.env;
  navigateTo({ appId: nexusAppId, baseUrl: allAppsUrl });
  cy.url().should('include', nexusRootUrl);
});

When('je navigue sur une page inexistante de Nexus', function () {
  const { nexusRootUrl } = this.env;
  cy.visit(`${nexusRootUrl}/page-inexistante`, { failOnStatusCode: false });
});

When("j'appelle l'API de Nexus", function () {
  const { nexusRootUrl } = this.env;
  cy.request(`${nexusRootUrl}/api`).as('apiResponse');
});

When('je réduis les animations de la page', function () {
  cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'Emulation.setEmulatedMedia',
      params: {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      },
    }),
  );
});
