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
| PLATFORM             | Platform under test | `partners`                                |
| TEST_ENV             | Test environment    | `docker` or `recette`, etc.               |
| TAGS                 | Tags expression     | Voir tableau des TAGS utilisés ci-dessous |

### TAGS utilisés

| TAGS | Description                                      |
| ---- | ------------------------------------------------ |
| @ci  | Scénario à exécuter sur la ci hors tests visuels |

## Scripts

### Run the Cypress tests on PARTNERS

#### Start the local stack for PARTNERS

- [More information regarding the local development stack](../../docker/_doc/README.md)

```shell
docker-stack prune && \
docker-stack up partners && \
docker-stack switch bdd-partners
```

#### Run the tests on docker environment in the terminal (deleting previous results)

1. [Start the local stack of PARTNERS using the docker-stack command](#start-the-local-stack-for-partners)
1. Run Cypress tests on PARTNERS against docker environment

```shell
yarn test
```

#### Run the tests from Cypress UI for docker environment

1. [Start the local stack of PARTNERS using the docker-stack command](#start-the-local-stack-for-partners)
1. Open Cypress UI to run tests on PARTNERS against docker environment

```shell
yarn start
```

#### Generate the Cucumber HTML report

```shell
CYPRESS_PLATFORM=partners CYPRESS_TEST_ENV=docker yarn report
```

## Gitlab test pipeline

You can create a test pipeline in Gitlab from a merge request or from the staging branch

1. Navigate to https://gitlab.dev-franceconnect.fr/france-connect/fc/-/pipelines/new
2. Add the pipeline variables (table below)
3. Click on the "Run pipeline" button
4. Start the back and front jobs

| Environment Variable | Description                           | Comment                                                        |
| -------------------- | ------------------------------------- | -------------------------------------------------------------- |
| CI_PIPELINE_SOURCE   | merge_request_event                   | if pipeline linked to a merge request                          |
| CI_MERGE_REQUEST_IID | id of the merge request               | for instance 860 for the merge request `/-/merge_requests/860` |
| BDD_TAGS_PARTNERS    | tags for the partners BDD tests       | by default '@ci and not @ignore'                               |

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
