# fcp-system-testing

FCP validation with system tests implemented using a Test Framework (based on Cypress/Cucumber)

## Documentation

- [BDD Framework documentation on the Wiki](https://gitlab.dev-franceconnect.fr/france-connect/documentation/-/wikis/Produits/Tests/Framework-BDD/Introduction)

## Folder Structure

- Features folder: [/cypress/integration](./cypress/integration)
- Steps/Pages folder (common): [/cypress/support/common](./cypress/support/common)
- Steps/Pages folder (dashboard): [/cypress/support/dashboard](./cypress/support/dashboard)
- Steps/Pages folder (eidas-bridge): [/cypress/support/eidas-bridge](./cypress/support/eidas-bridge)
- Steps/Pages folder (exploitation): [/cypress/support/exploitation](./cypress/support/exploitation)
- Steps/Pages folder (usager): [/cypress/support/usager](./cypress/support/usager)
- Test Data folder: [/cypress/fixtures](./cypress/fixtures)

## Environment Variables

| Environment Variable | Description                       | Comment                                      |
| -------------------- | --------------------------------- | -------------------------------------------- |
| PLATFORM             | Platform under test               | `fcp-high` or `fcp-low` or `fcp-legacy`      |
| TEST_ENV             | Test environment                  | `docker` or `integ01`, etc.                  |
| TAGS                 | Tags expression                   | `not @ignoreLow and not @fcpHigh`            |
| EXPLOIT_ADMIN_NAME   | Exploitation admin username       | needed only for integ01/preprod              |
| EXPLOIT_ADMIN_PASS   | Exploitation admin password       | needed only for integ01/preprod              |
| EXPLOIT_ADMIN_TOTP   | Exploitation admin totp secret    | needed only for integ01/preprod              |
| EXPLOIT_USER_NAME    | Exploitation operator username    | needed only for integ01/preprod              |
| EXPLOIT_USER_PASS    | Exploitation operator password    | needed only for integ01/preprod              |
| EXPLOIT_USER_TOTP    | Exploitation operator totp secret | needed only for integ01/preprod              |
| FC_ACCESS_USER       | FranceConnect network username    | needed on recette/integ01 outside FC network |
| FC_ACCESS_PASS       | FranceConnect network password    | needed on recette/integ01 outside FC network |

## Cross Domain Testing

On integ01 environment, the FranceConnect, FS and FI websites are using different domains.
In order to run tests with Cypress,

- we need to navigate to the different URLs via a unique page listing all the websites URLs
  - [Read more about Same superdomain per test](https://docs.cypress.io/guides/guides/web-security#Same-superdomain-per-test)
- we need to disable the chrome web security to allow redirections to different domains
  - [Read more about Disabling Web Security](https://docs.cypress.io/guides/guides/web-security#Set-chromeWebSecurity-to-false)
- we need to use Cookies with samesite=none (intercept in beforeEach hook)
  - [beforeEach hook](./cypress/support/common/steps/hooks.ts)
  - [Read more about SameSite cookie attribute](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Set-Cookie/SameSite)

## Continuous Integration

The BDD tests are run at different moments of the continuous integration:

### 1. on the merge request
  Before being able to merge a branch to `staging` branch, the BDD scenarios tagged with `@ci` are run. They represent the critical scenarios to pass in order to prevent system regression. When a new feature is implemented most of its scenarios should be tagged `@ci`. Then overtime, once the feature is more stable, only key scenarios remain tagged `@ci`.

### 2. overnight build of the `staging` branch

  Overnight build of the `staging` branch are executed. Those build run all the BDD tests. As no developpers are using Gitlab, we can run all the tests and not only the critical ones (tagged `@ci`).

### 3. after deployment to integ01 environment

  Most BDD tests are designed to be executed on both the local stack and the integ01 environment. We run all the scenarios available and not tagged `@ignoreInteg01`.

## Scripts

### Run the Cypress tests on FCP-LOW

#### Start the local stack for FCP-LOW

- [More information regarding the local development stack](../../docker/_doc/README.md)

```shell
docker-stack prune && \
docker-stack up bdd-fcp-low && \
docker-stack start-all
```

#### Run the tests in the terminal (deleting previous results)

1. [Start the local stack of FCP-LOW using the docker-stack command](#start-the-local-stack-for-fcp-low)
1. Run Cypress tests on FCP-LOW against docker environment

```shell
yarn test:low
```

#### Run the tests from Cypress UI

1. [Start the local stack of FCP-LOW using the docker-stack command](#start-the-local-stack-for-fcp-low)
1. Open Cypress UI to run tests on FCP-LOW against docker environment

```shell
yarn start:low
```

### Run the Cypress tests on FCP-HIGH

#### Start the local stack for FCP-HIGH

- [More information regarding the local development stack](../../docker/_doc/README.md)

```shell
docker-stack prune && \
docker-stack up bdd-fcp-high && \
docker-stack start-all
```

#### Run the tests on docker environment in the terminal (deleting previous results)

1. [Start the local stack of FCP-HIGH using the docker-stack command](#start-the-local-stack-for-fcp-high)
1. Run Cypress tests on FCP-HIGH against docker environment

```shell
yarn test:high
```

#### Run the tests from Cypress UI for docker environment

1. [Start the local stack of FCP-HIGH using the docker-stack command](#start-the-local-stack-for-fcp-high)
1. Open Cypress UI to run tests on FCP-HIGH against docker environment

```shell
yarn start:high
```

#### Run the tests from Cypress UI for integ01 environment

1. Update `cypress-fcp-high-base.config.ts` by changing the following env attributes

```json
"TEST_ENV": "integ01",
"EXPLOIT_USER_NAME": "<your integ01 operator user>",
"EXPLOIT_USER_PASS": "<your integ01 operator password>",
"EXPLOIT_USER_TOTP": "<your integ01 operator totp secret",
"FC_ACCESS_USER": "<FranceConnect access user for HTTP Basic Authentication>",
"FC_ACCESS_PASS": "<FranceConnect access password for HTTP Basic Authentication>",
```

2. Start the proxy to access `https://docker.dev-franceconnect.fr/integ01/fcp-high.html`

```shell
docker-stack up rp-all
```

3. Open Cypress UI to run tests on FCP-HIGH against integ01 environment

```shell
yarn start:high
```

4. Run the `usager` tests (user connection) or `exploitation` tests (if you have an operator user)

### Run the Cypress tests on user-dashboard

#### Start the local stack for user-dashboard

- [More information regarding the local user-dashboard stack](/front/apps/user-dashboard/README.md)

```shell
docker-stack prune && \
docker-stack up bdd-ud && \
docker-stack start-all
```

#### Run the tests in the terminal

1. [Start the local stack of user-dashboard using the docker-stack command](#start-the-local-stack-for-user-dashboard)
1. Run Cypress tests on user-dashboard against docker environment

```shell
yarn test:ud
```

#### Run the tests from Cypress UI

1. [Start the local stack of user-dashboard using the docker-stack command](#start-the-local-stack-for-user-dashboard)
1. Open Cypress UI to run tests on user-dashboard against docker environment

```shell
yarn start:ud
```

### Run the Cypress tests on eidas-bridge

#### Start the local stack for eidas-bridge

```shell
docker-stack prune && \
docker-stack up min-eidas-high && \
docker-stack start-all
```

#### Run the tests in the terminal

1. [Start the local stack of eidas-bridge using the docker-stack command](#start-the-local-stack-for-eidas-bridge)
1. Run Cypress tests on eidas-bridge against docker environment

```shell
yarn test:eidas
```

#### Run the tests from Cypress UI

1. [Start the local stack of eidas-bridge using the docker-stack command](#start-the-local-stack-for-eidas-bridge)
1. Open Cypress UI to run tests on eidas-bridge against docker environment

```shell
yarn start:eidas
```

### Generate the Cucumber HTML report

```shell
# Generate the report for fcp-high integ01
CYPRESS_PLATFORM=fcp-high CYPRESS_TEST_ENV=integ01 yarn report
```

## Accessibility Validation

We are running accessibility validation using the cypress plugin [cypress-axe](https://github.com/component-driven/cypress-axe).

Those tests are run alongside the other functional tests on the CI job.

### Run all the accessibility validations skipping the failures

It is possible to run all the accessibility validations without stopping on the first error, by defining the environment variable `skipFailures` when starting Cypress.

```shell
yarn start:high --env skipFailures=true

```

## Visual Validation

We are running visual validation using the cypress plugin [cypress-image-snapshot](https://github.com/jaredpalmer/cypress-image-snapshot).

The visual validations are done on Electron 94 headless in the terminal.

### Run the snapshot tests

- FCP-HIGH

```shell
yarn test:high:snapshot
```

- FCP-LOW

```shell
yarn test:low:snapshot
```

- USER-DASHBOARD

```shell
yarn test:ud:snapshot
```

### Update the base image files for all of your tests

- FCP-HIGH

```shell
yarn test:high:snapshot --env updateSnapshots=true
```

- FCP-LOW

```shell
yarn test:low:snapshot --env updateSnapshots=true
```

- USER-DASHBOARD

```shell
yarn test:ud:snapshot --env updateSnapshots=true
```

### Prevent test failures when an image diff does not pass

- FCP-HIGH

```shell
yarn test:high:snapshot --env failOnSnapshotDiff=false
```

- FCP-LOW

```shell
yarn test:low:snapshot --env failOnSnapshotDiff=false
```

- USER-DASHBOARD

```shell
yarn test:ud:snapshot --env failOnSnapshotDiff=false
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
| FC_LEGACY_VERSION    | branch from core-legacy repository    | only if not staging                                            |
| FC_APPS_VERSION      | branch from fc-apps repository        | only if not staging                                            |
| BDD_TAGS_FCP_LOW     | tags for the fcp-low BDD tests        | by default '@ci and not @ignoreLow and not @fcpHigh'           |
| BDD_TAGS_FCP_HIGH    | tags for the fcp-high BDD tests       | by default '@ci and not @ignoreHigh and not @fcpLow'           |
| BDD_TAGS_FCA_LOW     | tags for the fca-low BDD tests        | by default '@ci and not @ignore'                               |
| BDD_TAGS_EIDAS       | tags for the eidas-bridge BDD tests   | by default '@ci and not @ignore'                               |
| BDD_TAGS_UD          | tags for the user-dashboard BDD tests | by default '@ci and not @ignore'                               |
| RUN_E2E_FCP_HIGH     | 0 (skip end-to-end tests) or 1                                | by default 0 on MR and 1 on staging branch                     |
| RUN_E2E_FCA_LOW      | 0 (skip end-to-end tests) or 1                                | by default 0 on MR and 1 on staging branch                     |

## Plugins VSCode

### Cucumber (Gherkin) Full Support

Link: [CucumberAutoComplete plugin](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)

This plugin provides support for writing/maintaining scenarios in the feature files.
It automatically lists the implemented steps while editing the scenarios.

In order to setup the VSCode extension for FCP, you can either open the workspace from the `/quality/fcp` folder or copy the following settings in your VSCode User settings.

```json
{
  "cucumberautocomplete.customParameters": [],
  "cucumberautocomplete.steps": ["quality/fcp/cypress/support/**/steps/*.ts"],
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
