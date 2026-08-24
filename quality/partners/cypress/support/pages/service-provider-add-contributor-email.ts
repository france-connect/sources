const ADD_CONTRIBUTOR_SUBJECT_PREFIX =
  'Vous avez été ajouté(e) comme contributeur au fournisseur de service';

export default class ServiceProviderAddContributorEmailPage {
  private get maildevBaseUrl(): string {
    let baseUrl = `${Cypress.env('MAILDEV_PROTOCOL')}://${Cypress.env(
      'MAILDEV_HOST',
    )}`;
    if (Cypress.env('MAILDEV_API_PORT')) {
      baseUrl += `:${Cypress.env('MAILDEV_API_PORT')}`;
    }
    return baseUrl;
  }

  deleteMessagesSentTo(recipientEmail: string): void {
    cy.maildevGetAllMessages().then((messages) => {
      messages
        .filter((message) =>
          message.to.some(({ address }) => address === recipientEmail),
        )
        .forEach((message) => cy.maildevDeleteMessageById(message.id));
    });
  }

  visitLastMessageSentTo(recipientEmail: string): void {
    cy.maildevGetAllMessages().then((messages) => {
      const message = [...messages]
        .reverse()
        .find(
          (item) =>
            item.subject.startsWith(ADD_CONTRIBUTOR_SUBJECT_PREFIX) &&
            item.to.some(({ address }) => address === recipientEmail),
        );
      expect(
        message,
        `No add-contributor email was sent to '${recipientEmail}'`,
      ).to.exist;
      cy.visit(`${this.maildevBaseUrl}/email/${message.id}/html`);
    });
  }

  checkAdminNameContains(name: string): void {
    cy.contains('[data-testid="add-contributor-email-added-by"]', name);
  }

  checkServiceProviderNameContains(name: string): void {
    cy.contains('[data-testid="add-contributor-email-sp-name"]', name);
  }
}
