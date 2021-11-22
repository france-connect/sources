export function e2e(script) {
    const command = `${Cypress.env('FC_DOCKER_PATH')}/e2e.sh ${script}`;
    console.log(`
    Executing command:
    > ${command}
    `);

    return cy.exec(command).its('code').should('eq', 0);
}
