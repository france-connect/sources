export const waitForConnectionStatus = (timeout = 2000): void => {
  cy.wait('@api:me', { responseTimeout: timeout });
};

export const waitForContentRendering = (timeout = 2000): void => {
  cy.get('h1', { timeout }).should('be.visible');
};

export const spyClipboardWrite = (): void => {
  cy.window()
    .its('navigator.clipboard')
    .then((clipboard: Clipboard) =>
      cy.stub<Clipboard>(clipboard, 'writeText').as('clipboard:writeText'),
    );
};

export const checkClipboardWrite = (text: string): void => {
  cy.get('@clipboard:writeText')
    .should('have.been.calledOnce')
    .its('firstCall.args.0')
    .should('equal', text);
};
