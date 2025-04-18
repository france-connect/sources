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
| TAGS                 | Tags expression                   | `@fcpLow and not @ignoreLow`                 |
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

## Force test execution on MR

The following Merge Request labels force the execution of the BDD test jobs in Gitlab:

| Label            | Description                           |
| ---------------- | ------------------------------------- |
| CI Test all      | Run all the BDD test jobs             |
| CI Test fca-low  | Run the `fca-low` BDD test job        |
| CI Test fcp-low  | Run the `fcp-low` BDD test job        |
| CI Test fcp-high | Run the `fcp-high` BDD test job       |
| CI Test eidas    | Run the `eidas-bridge` BDD test job   |
| CI Test ud       | Run the `user-dashboard` BDD test job |
| CI Test partners | Run the `partners` BDD test job       |

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
docker-stack bdd-low-test
```

#### Run the tests from Cypress UI

1. [Start the local stack of FCP-LOW using the docker-stack command](#start-the-local-stack-for-fcp-low)
1. Open Cypress UI to run tests on FCP-LOW against docker environment

```shell
docker-stack bdd-low-open
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
docker-stack bdd-high-test
```

#### Run the tests from Cypress UI for docker environment

1. [Start the local stack of FCP-HIGH using the docker-stack command](#start-the-local-stack-for-fcp-high)
1. Open Cypress UI to run tests on FCP-HIGH against docker environment

```shell
docker-stack bdd-high-open
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
docker-stack bdd-high-test
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
docker-stack bdd-ud-test
```

#### Run the tests from Cypress UI

1. [Start the local stack of user-dashboard using the docker-stack command](#start-the-local-stack-for-user-dashboard)
1. Open Cypress UI to run tests on user-dashboard against docker environment

```shell
docker-stack bdd-ud-open
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
docker-stack bdd-eidas-test
```

#### Run the tests from Cypress UI

1. [Start the local stack of eidas-bridge using the docker-stack command](#start-the-local-stack-for-eidas-bridge)
1. Open Cypress UI to run tests on eidas-bridge against docker environment

```shell
docker-stack bdd-eidas-open
```

### Generate the Cucumber HTML report

```shell
# Generate the report for fcp-high integ01
CYPRESS_PLATFORM=fcp-high CYPRESS_TEST_ENV=integ01 docker-stack bdd-fcp-report
```

## Accessibility Validation

We are running accessibility validation using the cypress plugin [cypress-axe](https://github.com/component-driven/cypress-axe).

Those tests are run alongside the other functional tests on the CI job.

### Run all the accessibility validations skipping the failures

It is possible to run all the accessibility validations without stopping on the first error, by defining the environment variable `skipFailures` when starting Cypress.

```shell
docker-stack bdd-high-test --env skipFailures=true

```

## Visual Validation

We are running visual validation using the cypress plugin [cypress-image-snapshot](https://github.com/simonsmith/cypress-image-snapshot).

The visual validations are done on Electron 114 headless in the terminal.

### Run the snapshot tests

#### In a development environment

- FCP-HIGH

```shell
docker-stack bdd-high-test-visual
```

- FCP-LOW

```shell
docker-stack bdd-low-test-visual
```

- USER-DASHBOARD

```shell
docker-stack bdd-ud-test-visual
```

- eIDAS

```shell
docker-stack bdd-eidas-test-visual
```

#### As in a production environment

> :warning: Don't forget to reset the database afterward, if you want to run tests against the development environment

- FCP-HIGH

```shell
docker-stack reset-mongo-as-prod mongo-fcp-high
CYPRESS_TAGS='@fcpHigh and @validationVisuelleProduction and not @ignore' docker-stack bdd-high-test-visual
```

- FCP-LOW

```shell
docker-stack reset-mongo-as-prod mongo-fcp-low
CYPRESS_TAGS='@fcpLow and @validationVisuelleProduction and not @ignore' docker-stack bdd-low-test-visual
```

- USER-DASHBOARD

```shell
docker-stack reset-mongo-as-prod mongo-fcp-low
CYPRESS_TAGS='@userDashboard and @validationVisuelleProduction and not @ignore' docker-stack bdd-ud-test-visual
```

### Update the base image files for all of your tests

#### In a development environment

- FCP-HIGH

```shell
docker-stack bdd-high-test-visual --env updateSnapshots=true
```

- FCP-LOW

```shell
docker-stack bdd-low-test-visual --env updateSnapshots=true
```

- USER-DASHBOARD

```shell
docker-stack bdd-ud-test-visual --env updateSnapshots=true
```

- eIDAS

```shell
docker-stack bdd-eidas-test-visual --env updateSnapshots=true
```

#### As in a production environment

> :warning: Don't forget to reset the database afterward, if you want to run tests against the development environment

- FCP-HIGH

```shell
docker-stack reset-mongo-as-prod mongo-fcp-high
CYPRESS_TAGS='@fcpHigh and @validationVisuelleProduction and not @ignore' docker-stack bdd-high-test-visual --env updateSnapshots=true
```

- FCP-LOW

```shell
docker-stack reset-mongo-as-prod mongo-fcp-low
CYPRESS_TAGS='@fcpLow and @validationVisuelleProduction and not @ignore' docker-stack bdd-low-test-visual --env updateSnapshots=true
```

- USER-DASHBOARD

```shell
docker-stack reset-mongo-as-prod mongo-fcp-low
CYPRESS_TAGS='@userDashboard and @validationVisuelleProduction and not @ignore' docker-stack bdd-ud-test-visual --env updateSnapshots=true
```

### Prevent test failures when an image diff does not pass

- FCP-HIGH

```shell
docker-stack bdd-high-test-visual --env failOnSnapshotDiff=false
```

- FCP-LOW

```shell
docker-stack bdd-low-test-visual --env failOnSnapshotDiff=false
```

- USER-DASHBOARD

```shell
docker-stack bdd-ud-test-visual --env failOnSnapshotDiff=false
```

- eIDAS

```shell
docker-stack bdd-eidas-test-visual --env failOnSnapshotDiff=false
```

## Gitlab test pipeline

### Create a test pipeline

You can create a test pipeline in Gitlab from a merge request or from the staging branch

1. Navigate to https://gitlab.dev-franceconnect.fr/france-connect/fc/-/pipelines/new
2. Add the pipeline variables (table below)
3. Click on the "Run pipeline" button
4. Start the back and front jobs

| Environment Variable | Description                                                                  | Comment                                                          |
| -------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| CI_PIPELINE_SOURCE   | merge_request_event                                                          | if pipeline linked to a merge request                            |
| CI_MERGE_REQUEST_IID | id of the merge request                                                      | for instance 860 for the merge request `/-/merge_requests/860`   |
| FC_LEGACY_VERSION    | branch from core-legacy repository                                           | only if not staging                                              |
| FC_APPS_VERSION      | branch from fc-apps repository                                               | only if not staging                                              |
| SKIP_DIFF_CHECK      | allows to skip the difference check in order to force the BDD test execution | by default "true" for BDD jobs run on staging or MR from staging |
| BDD_TAGS_FCP_LOW     | tags for the fcp-low BDD tests                                               | by default '@fcpLow and not @ignoreLow and @ci'                  |
| BDD_TAGS_FCP_HIGH    | tags for the fcp-high BDD tests                                              | by default '@fcpHigh and not @ignoreHigh and @ci'                |
| BDD_TAGS_EIDAS       | tags for the eidas-bridge BDD tests                                          | by default '@ci and not @ignore'                                 |
| BDD_TAGS_UD          | tags for the user-dashboard BDD tests                                        | by default '@ci and not @ignore'                                 |

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
