# partners-system-testing

Partners validation with system tests implemented using a Test Framework (based on Cypress/Cucumber)

## Documentation

- [BDD Framework documentation on the Wiki](https://gitlab.dev-franceconnect.fr/france-connect/documentation/-/wikis/Produits/Tests/Framework-BDD/Introduction)

## Folder Structure

- Features folder: [/cypress/integration](./cypress/integration)
- Pages folder (partners): [/cypress/support/pages](./cypress/support/pages)
- Steps folder (partners): [/cypress/support/steps](./cypress/support/steps)
- Test Data folder: [/cypress/fixtures](./cypress/fixtures)

## Environment Variables

| Environment Variable | Description         | Comment                                   |
| -------------------- | ------------------- | ----------------------------------------- |
| PLATFORM             | Platform under test | `partners-fcp` or `partners-fca`          |
| TEST_ENV             | Test environment    | `docker` or `recette`, etc.               |
| TAGS                 | Tags expression     | Voir tableau des TAGS utilisés ci-dessous |

### TAGS utilisés

| TAGS       | Description                                      |
| ---------- | ------------------------------------------------ |
| @ci        | Scénario à exécuter sur la ci hors tests visuels |
| @fca       | Scénario valide pour AgentConnect seulement      |
| @fcp       | Scénario valide pour FranceConnect seulement     |
| @ignoreFca | Scénario non implémenté ou à réparer pour FCA    |
| @ignoreFcp | Scénario non implémenté ou à réparer pour FCP    |

## Scripts

### Run the Cypress tests on PARTNERS-FCP

#### Start the local stack for PARTNERS-FCP

- [More information regarding the local development stack](../../docker/_doc/README.md)

```shell
docker-stack prune && \
docker-stack up partners-fcp && \
docker-stack start partners-fcp
```

#### Run the tests on docker environment in the terminal (deleting previous results)

1. [Start the local stack of PARTNERS-FCP using the docker-stack command](#start-the-local-stack-for-partners-fcp)
1. Run Cypress tests on PARTNERS-FCP against docker environment

```shell
yarn test:fcp
```

#### Run the tests from Cypress UI for docker environment

1. [Start the local stack of PARTNERS-FCP using the docker-stack command](#start-the-local-stack-for-partners-fcp)
1. Open Cypress UI to run tests on PARTNERS-FCP against docker environment

```shell
yarn start:fcp
```

#### Generate the Cucumber HTML report

```shell
CYPRESS_PLATFORM=partners-fcp CYPRESS_TEST_ENV=docker yarn report
```

### Run the Cypress tests on PARTNERS-FCA

#### Start the local stack for PARTNERS-FCA

- [More information regarding the local development stack](../../docker/_doc/README.md)

```shell
docker-stack prune && \
docker-stack up partners-fca && \
docker-stack start partners-fca
```

#### Run the tests on docker environment in the terminal (deleting previous results)

1. [Start the local stack of PARTNERS-FCA using the docker-stack command](#start-the-local-stack-for-partners-fca)
1. Run Cypress tests on PARTNERS-FCA against docker environment

```shell
yarn test:fca
```

#### Run the tests from Cypress UI for docker environment

1. [Start the local stack of PARTNERS-FCA using the docker-stack command](#start-the-local-stack-for-partners-fca)
1. Open Cypress UI to run tests on PARTNERS-FCA against docker environment

```shell
yarn start:fca
```

#### Generate the Cucumber HTML report

```shell
CYPRESS_PLATFORM=partners-fca CYPRESS_TEST_ENV=docker yarn report
```

## Plugins VSCode

### Cucumber (Gherkin) Full Support

Link: [CucumberAutoComplete plugin](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)

This plugin provides support for writing/maintaining scenarios in the feature files.
It automatically lists the implemented steps while editing the scenarios.

In order to setup the VSCode extension for PARTNERS, you can either open the workspace from the `/quality/partners` folder or copy the following settings in your VSCode User settings.

```json
{
  "cucumberautocomplete.customParameters": [],
  "cucumberautocomplete.steps": [
    "quality/partners/cypress/support/**/steps/*.ts"
  ],
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.formatConfOverride": {
    "Fonctionnalité": 0,
    "Contexte": 1,
    "Scénario": 1,
    "Plan du Scénario:": 1,
    "Etant donné que": 2,
    "Et que": 2,
    "Quand": 2,
    "Alors": 2,
    "Et": 2,
    "Exemples:": 2,
    "\\*": 2,
    "\\|": 3,
    "#": "relative",
    "@": "relative"
  }
}
```
