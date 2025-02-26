import { When } from '@badeball/cypress-cucumber-preprocessor';

When(
  /^(j'arrête|je démarre) le service "([^"]+)"$/,
  function (text: string, service: string) {
    const action = text === "j'arrête" ? 'stop' : 'start';
    const command = `$FC_ROOT/fc/docker/docker-stack ${action} ${service}`;
    cy.exec(command, { timeout: 1000 });
  },
);
