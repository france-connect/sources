# fcp-system-testing

FCP validation with system tests implemented using a Test Framework (based on Cypress/Cucumber)

## Documentation

- [BDD Framework documentation on the Wiki](https://gitlab.dev-franceconnect.fr/france-connect/documentation/-/wikis/Produits/Tests/Framework-BDD/Introduction)

## Folder Structure

- Features folder: [/cypress/integration](./cypress/integration)
- Steps/Pages folder (exploitation): [/cypress/support/exploitation](./cypress/support/exploitation)
- Steps/Pages folder (usager): [/cypress/support/usager](./cypress/support/usager)
- Test Data folder: [/cypress/fixtures](./cypress/fixtures)

## Environment Variables

| Environment Variable | Description                       | Comment                                      |
| -------------------- | --------------------------------- | -------------------------------------------- |
| PLATFORM             | Platform under test               | `fcp-high` or `fcp-low`                      |
| TEST_ENV             | Test environment                  | `docker` or `recette`, etc.                  |
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

## Scripts

### Run the Cypress tests on FCP-LOW

#### Start the local stack for FCP-LOW

- [More information regarding the local development stack](../../docker/_doc/README.md)

```shell
docker-stack prune && \
docker-stack up all-fcp-low && \
docker-stack dependencies-all && \
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
docker-stack up all-fcp-high && \
docker-stack dependencies-all && \
docker-stack fixtures-v2
# Start all containers if the computer has more than 16GB of RAM
docker-stack start-all
# Start fewer containers otherwise (only tests using FIP1-high will pass)
docker-stack start csmr-hsm rnipp fsp1-high fsp2-high fsp5-high fsp6-high fip1-high core-fcp-high exploitation-high
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

#### Run the tests from Cypress UI for recette environment

1. Duplicate `cypress-fcp-high.json` and rename it `cypress-recette.json`
2. Change the following env attributes

  ```json
  "TEST_ENV": "recette",
  "FC_ACCESS_USER": "<FranceConnect access user for HTTP Basic Authentication>",
  "FC_ACCESS_PASS": "<FranceConnect access password for HTTP Basic Authentication>",
  ```

3. Run the job `review-fcp-high` on the merge request, in order to deploy the recette environment
4. Check that the recette environment is up and running navigating from `https://recette.dev-franceconnect.fr/fcp.html`
5. Open Cypress UI to run tests on FCP-HIGH against recette environment

  ```shell
  yarn start:high --config-file cypress-recette.json
  ```

6. Run the `usager` tests (user connection) or `exploitation` tests (admin configuration)

#### Run the tests from Cypress UI for integ01 environment

1. Duplicate `cypress-fcp-high.json` and rename it `cypress-integ01.json`
2. Change the following env attributes

  ```json
  "TEST_ENV": "integ01",
  "EXPLOIT_USER_NAME": "<your integ01 operator user>",
  "EXPLOIT_USER_PASS": "<your integ01 operator password>",
  "EXPLOIT_USER_TOTP": "<your integ01 operator totp secret",
  "FC_ACCESS_USER": "<FranceConnect access user for HTTP Basic Authentication>",
  "FC_ACCESS_PASS": "<FranceConnect access password for HTTP Basic Authentication>",
  ```

3. Start the proxy to access `https://docker.dev-franceconnect.fr/integ01/fcp.html`

  ```shell
  docker-stack up rp-all
  ```

4. Open Cypress UI to run tests on FCP-HIGH against integ01 environment

  ```shell
  yarn start:high --config-file cypress-integ01.json
  ```

5. Run the `usager` tests (user connection) or `exploitation` tests (if you have an operator user)

#### Run the user-dashboard tests from Cypress UI on user-dashboard local stack

1. Start the [user-dashboard local stack](/front/apps/user-dashboard/README.md)
2. Open Cypress UI to run tests on user-dashboard

  ```shell
  yarn start:high
  ```
  
3. Run the dashboard tests

### Generate the Cucumber HTML report

```
# Add Screenshots/Videos to the Cucumber logs
yarn report:prepare

# Generate the report for fcp-high integ01
CYPRESS_PLATFORM=fcp-high CYPRESS_TEST_ENV=integ01 yarn report:generate
```

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
