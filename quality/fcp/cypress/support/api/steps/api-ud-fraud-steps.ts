import { Step, When } from '@badeball/cypress-cucumber-preprocessor';

When('je lance la requête user-dashboard avec le csrf-token', function () {
  // Backup the current request preparation
  const currentRequest = { ...this.apiRequest };

  // Retrieve the csrf-token
  Step(this, 'je prépare une requête "ud csrf-token"');
  Step(this, 'je lance la requête');
  Step(this, 'je mémorise la propriété "csrfToken" du corps de la réponse');

  // Restore current request context
  cy.wrap(currentRequest).as('apiRequest');
  // Add csrf-token to the request headers
  Step(
    this,
    `je mets la donnée mémorisée "csrfToken" dans la propriété "x-csrf-token" de l'entête de la requête`,
  );

  Step(this, 'je lance la requête');
});
