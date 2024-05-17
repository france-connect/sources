# Framework Upgrade

## Cypress Upgrade

### Resources

#### Cypress Core

- [Cypress Migration Guide](https://docs.cypress.io/guides/references/migration-guide)
- [Cypress changelog](https://docs.cypress.io/guides/references/changelog)
- [Cypress issues](https://github.com/cypress-io/cypress/issues)

- [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor/releases)

#### Cypress Plugins

- [cypress-axe](https://yarnpkg.com/package?q=cypress-axe&name=cypress-axe)
- [cypress-image-snapshot](https://yarnpkg.com/package?q=cypress-image-snapshot&name=@simonsmith/cypress-image-snapshot)
- [cypress-plugin-api](https://yarnpkg.com/package?q=cypress-plugin-api&name=cypress-plugin-api)
- [cypress-maildev](https://yarnpkg.com/package?q=cypress-maildev&name=cypress-maildev)

#### Autres

- [axe-core (accessibility)](https://github.com/dequelabs/axe-core/releases)
- [multiple-cucumber-html-reporter (reporting)](https://yarnpkg.com/package?q=multiple-cucumber-html-reporter&name=multiple-cucumber-html-reporter)

### Upgrade Process

1. Read the Cypress Migration and changelog to detect interesting release to upgrade to
2. Check the opened issues on the release (the latest release could be unstable)
3. Check the compatibility with the Cypress Cucumber Preprocessor
4. Upgrade Cypress with the Cypress Cucumber Preprocessor
5. Check the impact on a test execution
6. Adjust the Cypress tests
7. Adjust the Cypress plugins
8. Run the tests BDD on FC+ and E2E on FC-APPS to check the stability of the run
9. Run the tests BDD on FC+, FC v2, agent-connect, user-dashboard, FC legacy
10. Run the tests E2E on FC-APPS and agent-connect

### Known issues

1. `cypress`:
From v13.6.1, there are more logs in the command line when executing tests. As Cypress has solved the issue with linux logs.
2. `cypress-maildev`:
The v1.3.2 changed the navigation to the mail content. `maildevVisitMessageById` uses a `cy.origin` call which prevents its usage on our local stack. (see https://github.com/Clebiez/cypress-maildev/pull/12/files)