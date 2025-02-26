import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

When(
  'je publie le message RabbitMQ dans la queue {string}',
  function (queue: string) {
    expect(this.rmqRequestMessage?.type).to.exist;

    const content = {
      data: this.rmqRequestMessage,
      pattern: this.rmqRequestMessage.type,
    };
    const args = {
      message: JSON.stringify(content),
      queue,
    };
    cy.task('rmqSendMessage', args).then((result: boolean) => {
      expect(result).to.be.true;
    });
  },
);

When('je consomme un message de la queue {string}', function (queue: string) {
  const args = {
    queue,
  };
  cy.task('rmqGetMessage', args)
    .as('rmqResponseMessage')
    .then((response) => cy.log(JSON.stringify(response)));
});

Then("aucun message RabbitMQ n'a été récupéré", function () {
  expect(this.rmqResponseMessage).to.equal(null);
});

Then(
  'la propriété {string} est {string} dans message RabbitMQ récupéré',
  function (property: string, value: string) {
    expect(this.rmqResponseMessage).to.exist;
    expect(Cypress._.get(this.rmqResponseMessage, property)).to.equal(value);
  },
);
